import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Get,
  Param,
  Res,
  UseGuards,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from 'express';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { Readable } from 'stream';

// Cloudinary Response Type
type CloudinaryResponse = UploadApiResponse | UploadApiErrorResponse;

@Controller('upload')
export class UploadController {

  /**
   * UPLOAD FILE
   * Protected Route: Admin only.
   * Uses FileInterceptor to extract file from form-data ('file' key).
   * Multer middleware handles storing the file to disk before this handler runs.
   */
  constructor() {
    // Configure Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Request() req) {
    if (!file) {
      return { error: 'No file uploaded' };
    }

    try {
      // Upload to Cloudinary using a stream
      const result = await new Promise<CloudinaryResponse>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'cms_uploads' }, // Optional folder in Cloudinary
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
        filename: result.public_id, // Or keep original name if preferred
      };
    } catch (error) {
      console.error('Cloudinary Upload Error:', error);
      throw error;
    }
  }

  /**
   * SERVE FILE
   * Public Route: Access uploaded images.
   * Example: http://localhost:3000/upload/files/abc.jpg
   */
  @Get('files/:imgpath')
  seeUploadedFile(@Param('imgpath') image, @Res() res: Response) {
    return res.sendFile(image, { root: './uploads' });
  }
}
