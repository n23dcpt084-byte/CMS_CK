import { IsNotEmpty, IsOptional, IsString, IsEnum, IsDateString, IsObject } from 'class-validator';

export class CreatePostDto {
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    content: string;

    @IsOptional()
    @IsString()
    slug?: string;

    @IsOptional()
    @IsString()
    imageUrl?: string;

    @IsOptional()
    @IsString()
    thumbnailUrl?: string;

    @IsOptional()
    @IsEnum(['original', 'facebook', 'youtube', 'tiktok', 'googledrive'])
    sourceType?: 'original' | 'facebook' | 'youtube' | 'tiktok' | 'googledrive';

    @IsOptional()
    @IsString() // '16:9', '4:3', '1:1', '9:16'
    mediaRatio?: string;

    @IsOptional()
    @IsString()
    sourceUrl?: string;

    @IsOptional()
    @IsEnum(['draft', 'scheduled', 'published', 'archived'])
    status?: string;

    @IsOptional()
    @IsDateString()
    publishedAt?: Date;

    @IsOptional()
    @IsObject()
    seo?: {
        title?: string;
        description?: string;
        keywords?: string;
    };

    @IsOptional()
    @IsObject()
    channels?: {
        web?: boolean;
        facebook?: boolean;
        tiktok?: boolean;
        youtube?: boolean;
    };

    @IsOptional()
    embeds?: {
        platform: string;
        url: string;
        embedUrl: string;
    }[];
}

export class UpdatePostDto {
    @IsOptional()
    title?: string;

    @IsOptional()
    content?: string;

    @IsOptional()
    @IsString()
    slug?: string;

    @IsOptional()
    @IsString()
    imageUrl?: string;

    @IsOptional()
    @IsString()
    thumbnailUrl?: string;

    @IsOptional()
    @IsEnum(['original', 'facebook', 'youtube', 'tiktok'])
    sourceType?: 'original' | 'facebook' | 'youtube' | 'tiktok';

    @IsOptional()
    @IsString()
    sourceUrl?: string;

    @IsOptional()
    @IsEnum(['draft', 'scheduled', 'published', 'archived'])
    status?: string;

    @IsOptional()
    @IsDateString()
    publishedAt?: Date;

    @IsOptional()
    @IsObject()
    seo?: {
        title?: string;
        description?: string;
        keywords?: string;
    };

    @IsOptional()
    @IsObject()
    channels?: {
        web?: boolean;
        facebook?: boolean;
        tiktok?: boolean;
        youtube?: boolean;
    };

    @IsOptional()
    embeds?: {
        platform: string;
        url: string;
        embedUrl: string;
    }[];
}
