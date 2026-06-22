import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as fs from 'fs';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  fs.mkdirSync(process.env.UPLOAD_DIR || './uploads', { recursive: true });
  await app.listen(Number(process.env.PORT || 3000), '0.0.0.0');
}
bootstrap();
