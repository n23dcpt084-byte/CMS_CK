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
      console.error('❌ No file uploaded');
      throw new InternalServerErrorException('No file uploaded');
    }

    // Explicitly reject if credentials are bad
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      throw new InternalServerErrorException('Server Misconfiguration: Missing Cloudinary Credentials');
    }

    // 🟢 DETECT FILE TYPE
    const mimeType = file.mimetype;
    let resourceType: 'image' | 'video' | 'auto' = 'image'; // Default

    if (mimeType.startsWith('video/')) {
      resourceType = 'video';
      console.log(`🎥 Uploading Video: ${file.originalname}`);
    } else if (mimeType.startsWith('image/')) {
      resourceType = 'image';
      console.log(`🖼️ Uploading Image: ${file.originalname}`);
    } else {
      console.warn(`⚠️ Unsupported MimeType: ${mimeType}`);
      throw new InternalServerErrorException('Unsupported file type. Only Images and Videos are allowed.');
    }

    try {
      const result = await new Promise<CloudinaryResponse>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'cms_uploads',
            resource_type: resourceType, // 🟢 CRITICAL: 'video' or 'image'
          },
          (error, result) => {
            if (error) {
              console.error('Cloudinary Callback Error:', error);
              return reject(error);
            }
            if (!result) return reject(new Error('Cloudinary upload returned undefined'));
            resolve(result);
          },
        );
        Readable.from(file.buffer).pipe(uploadStream);
      });

      console.log(`✅ Upload Success: ${result.secure_url}`);

      return {
        url: result.secure_url,
        filename: result.public_id,
        resource_type: result.resource_type,
        original_filename: result.original_filename
      };
    } catch (error) {
      console.error('❌ Cloudinary Upload Error Details:', error);
      throw new InternalServerErrorException('Upload Failed: ' + (error.message || 'Unknown Error'));
    }
  }
}
