import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { CreatePostDto, UpdatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) { }

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const newPost = new this.postModel({
      ...createPostDto,
      author: 'Admin', // Hardcoded for simplified scope
    });
    return newPost.save();
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
}
