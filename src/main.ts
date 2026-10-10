import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  // Allow larger uploads (10MB) — fixes 413 error on image upload
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));

  app.enableCors({
    origin: [
      'http://127.0.0.1:5500',
      'https://royal-cash-lemon.vercel.app'
    ],
    credentials: true,
  });

  await app.listen(3000);
}

bootstrap();
