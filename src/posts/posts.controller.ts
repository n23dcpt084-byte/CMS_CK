import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto, UpdatePostDto } from './dto/create-post.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) { }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    create(@Body() createPostDto: CreatePostDto) {
        return this.postsService.create(createPostDto);
    }

    // 🟢 PUBLIC ENDPOINTS
    @Get('public')
    findPublic() {
        return this.postsService.findPublic();
    }

    @Get('public/:id')
    findPublicOne(@Param('id') id: string) {
        // Fallback or ID fetch
        // If it looks like ID, use ID. Else try slug?
        // Better to separate, but for compatibility let's keep check.
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            return this.postsService.findPublicOne(id);
        } else {
            return this.postsService.findBySlug(id);
        }
    }

    // 🟢 SPECIFIC SLUG ROUTE
    @Get('public/slug/:slug')
    findBySlug(@Param('slug') slug: string) {
        return this.postsService.findBySlug(slug);
    }

    @Get()
    findAll() {
        return this.postsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.postsService.findOne(id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch(':id')
    update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
        return this.postsService.update(id, updatePostDto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.postsService.remove(id);
    }
}
