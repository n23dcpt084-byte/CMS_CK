import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Request,
  InternalServerErrorException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { Readable } from 'stream';

type CloudinaryResponse = UploadApiResponse | UploadApiErrorResponse;

@Controller('upload')
export class UploadController {
  constructor() {
    // Fail fast if credentials are missing
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      console.error('❌ Missing Cloudinary Credentials');
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Request() req) {
    if (!file) {
      return { error: 'No file uploaded' };
    }

    // Explicitly reject if credentials are bad to prevent 500 loop
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      throw new InternalServerErrorException('Server Misconfiguration: Missing Cloudinary Credentials');
    }

    try {
      const result = await new Promise<CloudinaryResponse>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'cms_uploads' },
          (error, result) => {
            if (error) return reject(error);
            if (!result) return reject(new Error('Cloudinary upload returned undefined'));
            resolve(result);
          },
        );
        Readable.from(file.buffer).pipe(uploadStream);
      });

      return {
        url: result.secure_url,
        filename: result.public_id,
      };
    } catch (error) {
      console.error('Cloudinary Upload Error:', error);
      throw new InternalServerErrorException('Image Upload Failed');
    }
  }
}
