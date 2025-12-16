import { IsNotEmpty, IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';

export class CreatePostDto {
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    content: string;

    @IsOptional()
    @IsString()
    imageUrl?: string;

    @IsOptional()
    @IsEnum(['draft', 'scheduled', 'published'])
    status?: string;

    @IsOptional()
    @IsDateString()
    publishedAt?: Date;
}

export class UpdatePostDto {
    @IsOptional()
    title?: string;

    @IsOptional()
    content?: string;

    @IsOptional()
    imageUrl?: string;

    @IsOptional()
    @IsEnum(['draft', 'scheduled', 'published'])
    status?: string;

    @IsOptional()
    @IsDateString()
    publishedAt?: Date;
}
