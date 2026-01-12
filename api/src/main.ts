import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

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

  // ============================================
  // SWAGGER КОНФІГУРАЦІЯ
  // ============================================
  const config = new DocumentBuilder()
    .setTitle('News Portal API')
    .setDescription('API документація для порталу новин')
    .setVersion('1.0')
    .addTag('auth', 'Аутентифікація та реєстрація')
    .addTag('users', 'Керування користувачами')
    .addTag('news', 'Керування новинами')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Введіть JWT токен',
        in: 'header',
      },
      'JWT-auth', // Це ім'я буде використовуватись в @ApiBearerAuth()
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // Зберігає токен між перезавантаженнями
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customSiteTitle: 'News Portal API Docs',
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log('Server is running http://localhost:3000');
  console.log('API of news: http://localhost:' + port + '/api/news');
  console.log('Swagger Docs: http://localhost:' + port + '/api/docs');
  console.log('Connect to Supabase');
}
bootstrap();
