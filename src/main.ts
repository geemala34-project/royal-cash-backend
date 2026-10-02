import * as dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);

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
