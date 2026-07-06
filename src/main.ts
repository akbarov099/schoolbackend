import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Frontend har xil formatdagi ma'lumot yuborishi mumkin, shuning uchun
  // whitelist qat'iy emas — faqat validatsiya qilamiz
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  // Frontend (React) bilan ishlashi uchun CORS ochamiz
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Barcha route'lar /api prefiksi bilan ishlaydi (frontenddagi baseURL: '.../api' ga mos)
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 5000;
  await app.listen(port);
  console.log(`🚀 Server ishga tushdi: http://localhost:${port}/api`);
}
bootstrap();
