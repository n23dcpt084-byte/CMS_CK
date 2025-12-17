import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { memoryStorage } from 'multer';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MulterModule.register({
      storage: memoryStorage(), // Use memory storage to get buffer
    }),
    AuthModule,
  ],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule { }
