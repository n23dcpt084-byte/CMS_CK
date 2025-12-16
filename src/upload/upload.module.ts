import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { memoryStorage } from 'multer';

@Module({
  imports: [
    MulterModule.register({
      storage: memoryStorage(), // Use memory storage to get buffer
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule { }
