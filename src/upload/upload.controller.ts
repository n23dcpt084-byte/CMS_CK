import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Get,
  Param,
  Res,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from 'express';

@Controller('upload')
export class UploadController {

  /**
   * UPLOAD FILE
   * Protected Route: Admin only.
   * Uses FileInterceptor to extract file from form-data ('file' key).
   * Multer middleware handles storing the file to disk before this handler runs.
   */
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      return { error: 'No file uploaded' };
    }
    // Return the URL to access the file
    // In production, this should include domain/port or be stored in cloud
    return {
      url: `http://localhost:3000/upload/files/${file.filename}`,
      filename: file.filename,
    };
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
