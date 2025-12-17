import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ShortsService } from './shorts.service';
import { ShortsController } from './shorts.controller';
import { Short, ShortSchema } from './schemas/short.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Short.name, schema: ShortSchema }]),
        AuthModule,
    ],
    controllers: [ShortsController],
    providers: [ShortsService],
})
export class ShortsModule { }
