import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    content: string;

    @IsOptional()
    @IsString()
    imageUrl?: string;
}

export class UpdatePostDto {
    @IsOptional()
    title?: string;

    @IsOptional()
    content?: string;

    @IsOptional()
    imageUrl?: string;
}
