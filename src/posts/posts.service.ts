import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { CreatePostDto, UpdatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) { }

  async create(createPostDto: CreatePostDto): Promise<Post> {
    // 🟢 GENERATE SLUG IF MISSING
    if (!createPostDto.slug) {
      createPostDto.slug = this.generateSlug(createPostDto.title);
    } else {
      createPostDto.slug = this.generateSlug(createPostDto.slug);
    }
    // TODO: Check uniqueness loop if needed, but for now rely on Mongoose unique index or simple appending

    // Ensure uniqueness basic check
    const existing = await this.postModel.findOne({ slug: createPostDto.slug }).exec();
    if (existing) {
      createPostDto.slug = `${createPostDto.slug}-${Date.now()}`;
    }

    const newPost = new this.postModel({
      ...createPostDto,
      author: 'Admin', // Hardcoded for simplified scope
    });
    return newPost.save();
  }

  private generateSlug(text: string): string {
    return text.toString().toLowerCase()
      .trim()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-');        // Replace multiple - with single -
  }

  async findAll(): Promise<Post[]> {
    return this.postModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Post> {
    const post = await this.postModel.findById(id).exec();
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return post;
  }

  private readonly logger = new Logger(PostsService.name);

  async update(id: string, updatePostDto: UpdatePostDto): Promise<Post> {
    try {
      if (updatePostDto.title && !updatePostDto.slug) {
        // Optionally update slug if title changes and no slug provided? 
        // For stability, we usually don't change slug automatically on update unless requested.
        // But if slug IS provided, sanitize it.
      }
      if (updatePostDto.slug) {
        updatePostDto.slug = this.generateSlug(updatePostDto.slug);
      }

      const updatedPost = await this.postModel
        .findByIdAndUpdate(id, updatePostDto, { new: true })
        .exec();

      if (!updatedPost) {
        throw new NotFoundException(`Post with ID ${id} not found`);
      }
      return updatedPost;
    } catch (error) {
      this.logger.error(`Failed to update post ${id}`, error.stack);
      if (error instanceof NotFoundException) {
        throw error;
      }
      // Handle Invalid ID (CastError) specifically if needed, or rethrow
      if (error.name === 'CastError') {
        throw new NotFoundException(`Invalid Post ID format: ${id}`);
      }
      throw error;
    }
  }

  async remove(id: string): Promise<any> {
    const result = await this.postModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return result;
  }

  // 🟢 PUBLIC API METHODS
  async findPublic(): Promise<Post[]> {
    return this.postModel
      .find({ status: 'published' })
      .select('title imageUrl content publishedAt createdAt author viewCount') // Select necessary fields
      .sort({ publishedAt: -1 })
      .exec();
  }

  async findPublicOne(id: string): Promise<Post> {
    try {
      // 🟢 Increment View Count atomically and get updated doc
      // Try finding by ID first
      let post = await this.postModel.findOneAndUpdate(
        { _id: id, status: 'published' },
        { $inc: { viewCount: 1 } },
        { new: true }
      ).exec();

      if (!post) {
        throw new NotFoundException(`Post not found.`);
      }
      return post;
    } catch (error) {
      throw new NotFoundException(`Post not found.`);
    }
  }

  // 🟢 NEW: FIND BY SLUG
  async findBySlug(slug: string): Promise<Post> {
    const post = await this.postModel.findOneAndUpdate(
      { slug: slug, status: 'published' },
      { $inc: { viewCount: 1 } },
      { new: true }
    ).exec();

    if (!post) {
      throw new NotFoundException(`Post not found.`);
    }
    return post;
  }

  // 🟢 CRON JOB: Check every minute for scheduled posts
  @Cron(CronExpression.EVERY_MINUTE)
  async handleScheduledPosts() {
    const now = new Date();
    this.logger.debug(`Checking scheduled posts at ${now.toISOString()}...`);

    // Find posts that are 'scheduled' AND publishedAt <= now
    const duePosts = await this.postModel.find({
      status: 'scheduled',
      publishedAt: { $lte: now },
    }).exec();

    if (duePosts.length > 0) {
      this.logger.log(`Found ${duePosts.length} posts due for publishing.`);

      for (const post of duePosts) {
        post.status = 'published';
        // Keep publishedAt as the scheduled time, or update to exact now? 
        // Keeping it as scheduled time is usually better for "intended" publish time, 
        // but updating to 'now' might be safer for sort order. 
        // Let's keep it as is, just flip status.
        await post.save();
        this.logger.log(`Published post: "${post.title}" (ID: ${post._id})`);
      }
    }
  }
}
