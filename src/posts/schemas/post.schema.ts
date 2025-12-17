import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PostDocument = Post & Document;

@Schema({ timestamps: true })
export class Post {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    content: string;

    @Prop()
    imageUrl: string;

    // Simplified: Author is just a string (e.g. "Admin") for this project scope
    @Prop({ default: 'Admin' })
    author: string;

    @Prop({ default: 'draft', enum: ['draft', 'scheduled', 'published', 'archived'] }) // 🟢 Added 'archived'
    status: string;

    @Prop({ type: Date, default: null })
    publishedAt: Date;

    // 🟢 ANALYTICS
    @Prop({ default: 0 })
    viewCount: number;

    // 🟢 SEO METADATA
    @Prop({ type: Object, default: {} })
    seo: {
        title?: string;
        description?: string;
        keywords?: string;
    };
}

export const PostSchema = SchemaFactory.createForClass(Post);
