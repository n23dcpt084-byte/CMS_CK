import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { UploadModule } from './upload/upload.module';
import { ShortsModule } from './shorts/shorts.module';

/**
 * AppModule
 * This is the root module of the application.
 * It acts as the container that aggregates all other feature modules (Auth, Posts, Upload).
 * It also handles global configurations, such as the Database connection and Environment variables.
 */
@Module({
  imports: [
    // ConfigModule: Loads environment variables (like MONGO_URI) from the .env file
    // isGlobal: true ensures we don't need to import ConfigModule in every other module.
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // MongooseModule: Configures the connection to the MongoDB database.
    // We use forRootAsync to ensure we can read the MONGO_URI from the ConfigService (environment variables).
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI') || 'mongodb://localhost:27017/cms_project_db',
        // Fail fast settings: If DB is down, error out quickly (5s) instead of hanging indefinitely.
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000,
      }),
      inject: [ConfigService],
    }),

    // ScheduleModule: Enables scheduling capabilities (e.g., cron jobs).
    ScheduleModule.forRoot(),

    // Feature Modules: Importing the specific business logic modules
    AuthModule,   // Handles Admin Authentication (Login, JWT)
    PostsModule,  // Handles Blog Posts (CRUD)
    UploadModule, // Handles Image Uploads
    ShortsModule, // Handles Short Videos
  ],
})
export class AppModule { }
