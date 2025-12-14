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
  uploadFile(@UploadedFile() file: Express.Multer.File, @Request() req) {
    if (!file) {
      return { error: 'No file uploaded' };
    }
    // Dynamic URL construction (works on Localhost and Render)
    const protocol = req.protocol;
    const host = req.get('host');
    const fullUrl = `${protocol}://${host}/upload/files/${file.filename}`;

    return {
      url: fullUrl,
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
