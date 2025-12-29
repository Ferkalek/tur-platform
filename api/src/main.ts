import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // alow CORS
  app.enableCors();

  // prefix for router
  app.setGlobalPrefix('api');

  // data validation
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT ?? 3000);

  console.log('Server is running http://localhost:3000');
  console.log('API of news: http://localhost:3000/api/news');
}
bootstrap();
