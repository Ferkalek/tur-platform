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
  // app.useGlobalPipes(new ValidationPipe());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log('Server is running http://localhost:3000');
  console.log('API of news: http://localhost:' + port + '/api/news');
  console.log('Connect to Supabase');
}
bootstrap();
