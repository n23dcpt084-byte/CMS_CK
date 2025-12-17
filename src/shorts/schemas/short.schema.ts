import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ShortDocument = Short & Document;

@Schema({ timestamps: true })
export class Short {
    @Prop({ required: true })
    caption: string;

    @Prop({ required: true })
    mediaUrl: string;

    @Prop({ enum: ['video', 'image'], default: 'video' })
    mediaType: string;

    @Prop({ enum: ['upload', 'youtube', 'tiktok', 'facebook'], default: 'upload' })
    platform: string;

    @Prop()
    thumbnailUrl: string;

    @Prop({ default: 'draft', enum: ['draft', 'scheduled', 'published'] })
    status: string;

    @Prop({ type: Date, default: null })
    publishedAt: Date;

    @Prop({ default: 0 })
    viewCount: number;
}

export const ShortSchema = SchemaFactory.createForClass(Short);
