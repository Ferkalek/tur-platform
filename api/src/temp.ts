// ============================================
// КРОК 1: Встановити залежності
// ============================================

/*
npm install @nestjs/swagger swagger-ui-express
*/

// ============================================
// КРОК 2: src/main.ts (ОНОВЛЕНО)
// ============================================

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // CORS
  app.enableCors();
  
  // Префікс для API
  app.setGlobalPrefix('api');
  
  // Валідація
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
  
  console.log('🚀 Сервер запущено на http://localhost:' + port);
  console.log('📰 API новин: http://localhost:' + port + '/api/news');
  console.log('📚 Swagger документація: http://localhost:' + port + '/api/docs');
  console.log('✅ Підключено до Supabase');
}
bootstrap();

// ============================================
// КРОК 3: Додати декоратори до DTO
// ============================================

// src/auth/dto/register.dto.ts
import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'Email користувача',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Невалідний email' })
  email: string;

  @ApiProperty({
    description: 'Пароль користувача',
    example: 'password123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6, { message: 'Пароль повинен містити мінімум 6 символів' })
  password: string;

  @ApiProperty({
    description: "Ім'я користувача",
    example: 'Іван',
    maxLength: 100,
  })
  @IsString()
  @MaxLength(100)
  firstName: string;

  @ApiProperty({
    description: 'Прізвище користувача',
    example: 'Петренко',
    maxLength: 100,
  })
  @IsString()
  @MaxLength(100)
  lastName: string;
}

// src/auth/dto/login.dto.ts
import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Email користувача',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Невалідний email' })
  email: string;

  @ApiProperty({
    description: 'Пароль користувача',
    example: 'password123',
  })
  @IsString()
  password: string;
}

// src/news/dto/create-news.dto.ts
import { IsString, IsNotEmpty, MaxLength, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNewsDto {
  @ApiProperty({
    description: 'Заголовок новини',
    example: 'Нові технології в веб-розробці',
    maxLength: 80,
  })
  @IsString()
  @IsNotEmpty({ message: "Заголовок обов'язковий" })
  @MaxLength(80, { message: 'Заголовок не може бути довше 80 символів' })
  title: string;

  @ApiProperty({
    description: 'Короткий опис новини',
    example: 'Огляд найважливіших трендів 2025 року',
  })
  @IsString()
  @IsNotEmpty({ message: "Короткий опис обов'язковий" })
  excerpt: string;

  @ApiProperty({
    description: 'Повний контент новини',
    example: 'У 2025 році веб-розробка досягла нових висот...',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty({ message: "Контент обов'язковий" })
  @MaxLength(255, { message: 'Контент не може бути довше 255 символів' })
  content: string;

  @ApiProperty({
    description: 'URL зображення для новини',
    example: 'https://picsum.photos/800/400',
  })
  @IsString()
  @IsUrl({}, { message: 'Невалідна URL адреса зображення' })
  image: string;
}

// src/news/dto/update-news.dto.ts
import { IsString, IsOptional, MaxLength, IsUrl } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateNewsDto {
  @ApiPropertyOptional({
    description: 'Заголовок новини',
    example: 'Оновлений заголовок',
    maxLength: 80,
  })
  @IsString()
  @IsOptional()
  @MaxLength(80)
  title?: string;

  @ApiPropertyOptional({
    description: 'Короткий опис новини',
    example: 'Оновлений опис',
  })
  @IsString()
  @IsOptional()
  excerpt?: string;

  @ApiPropertyOptional({
    description: 'Повний контент новини',
    example: 'Оновлений контент...',
    maxLength: 255,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  content?: string;

  @ApiPropertyOptional({
    description: 'URL зображення',
    example: 'https://picsum.photos/800/400',
  })
  @IsString()
  @IsOptional()
  @IsUrl()
  image?: string;
}

// src/users/dto/update-profile.dto.ts
import { IsString, IsOptional, MaxLength, IsUrl } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiPropertyOptional({
    description: "Ім'я користувача",
    example: 'Іван',
    maxLength: 100,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  firstName?: string;

  @ApiPropertyOptional({
    description: 'Прізвище користувача',
    example: 'Петренко',
    maxLength: 100,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  lastName?: string;

  @ApiPropertyOptional({
    description: 'Номер телефону',
    example: '+380501234567',
    maxLength: 20,
  })
  @IsString()
  @IsOptional()
  @MaxLength(20, { message: 'Номер телефону надто довгий' })
  phone?: string;

  @ApiPropertyOptional({
    description: 'Коротка біографія',
    example: 'Full-stack розробник з 5-річним досвідом',
    maxLength: 500,
  })
  @IsString()
  @IsOptional()
  @MaxLength(500, { message: 'Біографія надто довга' })
  bio?: string;

  @ApiPropertyOptional({
    description: 'Посилання на соціальну мережу',
    example: 'https://linkedin.com/in/ivan-petrenko',
  })
  @IsString()
  @IsOptional()
  @IsUrl({}, { message: 'Невалідне посилання на соціальну мережу' })
  socialLink?: string;

  @ApiPropertyOptional({
    description: 'URL аватара',
    example: 'https://i.pravatar.cc/300',
  })
  @IsString()
  @IsOptional()
  @IsUrl({}, { message: 'Невалідне посилання на аватар' })
  avatar?: string;
}

// ============================================
// КРОК 4: Додати декоратори до Controllers
// ============================================

// src/auth/auth.controller.ts
import { Controller, Post, Body, Get, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Реєстрація нового користувача' })
  @ApiResponse({ 
    status: 201, 
    description: 'Користувач успішно зареєстрований. Повертає JWT токен.' 
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Користувач з таким email вже існує' 
  })
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Вхід користувача в систему' })
  @ApiResponse({ 
    status: 200, 
    description: 'Успішний вхід. Повертає JWT токен.' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Невірний email або пароль' 
  })
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Отримати дані поточного користувача' })
  @ApiResponse({ 
    status: 200, 
    description: 'Дані користувача отримано' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Не авторизований' 
  })
  async getProfile(@CurrentUser() user: any) {
    return user;
  }
}

// src/users/users.controller.ts
import { Controller, Get, Put, Body, UseGuards, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Отримати свій профіль' })
  @ApiResponse({ status: 200, description: 'Профіль отримано' })
  @ApiResponse({ status: 401, description: 'Не авторизований' })
  async getMyProfile(@CurrentUser() user: any) {
    return await this.usersService.findById(user.id);
  }

  @Put('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Оновити свій профіль' })
  @ApiResponse({ status: 200, description: 'Профіль оновлено' })
  @ApiResponse({ status: 401, description: 'Не авторизований' })
  async updateMyProfile(
    @CurrentUser() user: any,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return await this.usersService.updateProfile(user.id, updateProfileDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати публічний профіль користувача' })
  @ApiParam({ name: 'id', description: 'UUID користувача' })
  @ApiResponse({ status: 200, description: 'Профіль користувача' })
  @ApiResponse({ status: 404, description: 'Користувача не знайдено' })
  async getUserProfile(@Param('id') id: string) {
    return await this.usersService.findById(id);
  }
}

// src/news/news.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth, 
  ApiParam 
} from '@nestjs/swagger';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('news')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  @ApiOperation({ summary: 'Отримати всі новини' })
  @ApiResponse({ 
    status: 200, 
    description: 'Список всіх опублікованих новин' 
  })
  async findAll() {
    return await this.newsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати новину за ID' })
  @ApiParam({ name: 'id', description: 'UUID новини' })
  @ApiResponse({ status: 200, description: 'Новина знайдена' })
  @ApiResponse({ status: 404, description: 'Новину не знайдено' })
  async findOne(@Param('id') id: string) {
    return await this.newsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Створити нову новину' })
  @ApiResponse({ status: 201, description: 'Новина створена' })
  @ApiResponse({ status: 401, description: 'Не авторизований' })
  @ApiResponse({ status: 400, description: 'Невалідні дані' })
  async create(
    @Body() createNewsDto: CreateNewsDto,
    @CurrentUser() user: any,
  ) {
    return await this.newsService.create(createNewsDto, user.id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Оновити новину' })
  @ApiParam({ name: 'id', description: 'UUID новини' })
  @ApiResponse({ status: 200, description: 'Новина оновлена' })
  @ApiResponse({ status: 401, description: 'Не авторизований' })
  @ApiResponse({ status: 403, description: 'Немає прав на редагування' })
  @ApiResponse({ status: 404, description: 'Новину не знайдено' })
  async update(
    @Param('id') id: string,
    @Body() updateNewsDto: UpdateNewsDto,
    @CurrentUser() user: any,
  ) {
    return await this.newsService.update(id, updateNewsDto, user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Видалити новину' })
  @ApiParam({ name: 'id', description: 'UUID новини' })
  @ApiResponse({ status: 200, description: 'Новина видалена' })
  @ApiResponse({ status: 401, description: 'Не авторизований' })
  @ApiResponse({ status: 403, description: 'Немає прав на видалення' })
  @ApiResponse({ status: 404, description: 'Новину не знайдено' })
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    return await this.newsService.remove(id, user.id);
  }
}

// ============================================
// ЯК КОРИСТУВАТИСЬ SWAGGER
// ============================================

/*
1. Запустіть проект:
   npm run start:dev

2. Відкрийте браузер:
   http://localhost:3000/api/docs

3. Ви побачите інтерактивну документацію з усіма endpoints!

4. Як авторизуватись в Swagger:
   a) Зареєструйтесь або залогіньтесь через endpoint /api/auth/login
   b) Скопіюйте access_token з відповіді
   c) Натисніть кнопку "Authorize" 🔒 вгорі справа
   d) Вставте токен (БЕЗ слова "Bearer")
   e) Натисніть "Authorize"
   f) Тепер можете тестувати захищені endpoints!

5. Тестування endpoints:
   - Розгорніть будь-який endpoint
   - Натисніть "Try it out"
   - Заповніть дані
   - Натисніть "Execute"
   - Побачите відповідь сервера

6. Переваги Swagger:
   ✅ Інтерактивне тестування API
   ✅ Автоматична документація
   ✅ Зберігає токен між запитами
   ✅ Валідація даних у реальному часі
   ✅ Приклади для кожного поля
   ✅ Експорт в OpenAPI/JSON формат
*/