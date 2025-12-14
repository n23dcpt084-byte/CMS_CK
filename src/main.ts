import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';

/**
 * Bootstrap function
 * This is the entry point of the NestJS application.
 * It is asynchronous because it needs to wait for the application to be fully initialized,
 * which includes connecting to the database and setting up the server.
 */
async function bootstrap() {
  const logger = new Logger('Bootstrap');

  // Create the NestJS application instance using the root AppModule
  const app = await NestFactory.create(AppModule);

  // Enable CORS (Cross-Origin Resource Sharing)
  // This is required to allow the frontend to communicate with this backend API
  // even if they are running on different ports or domains.
  app.enableCors();

  // Enable Global Validation Pipe
  // This ensures that all incoming data is validated against our DTOs (Data Transfer Objects).
  // - whitelist: true -> Strips out properties that are not defined in the DTO
  // - transform: true -> Automatically transforms input data to the types specified in the DTO
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true
  }));

  const port = process.env.PORT || 3000;

  // Start the HTTP server
  // This binds the application to the specified port and starts listening for incoming requests.
  await app.listen(port);

  logger.log(`Nest application successfully started`);
  logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
