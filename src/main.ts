import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties not defined in the DTO
      forbidNonWhitelisted: true, // Throw error for unexpected properties
      transform: true, // Automatically transform input to DTO types
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
