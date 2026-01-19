// ============================================
// КРОК 1: Встановити залежності
// ============================================

/*
npm install multer
npm install -D @types/multer
*/

// ============================================
// КРОК 2: Створити папку для файлів
// ============================================

/*
Створіть папку в корені проекту:
mkdir uploads
mkdir uploads/avatars
mkdir uploads/news

Додайте в .gitignore:
uploads/
*/

// ============================================
// КРОК 3: Оновити .env
// ============================================

/*
PORT=3000
NODE_ENV=development

# Supabase Database
DB_HOST=aws-0-eu-central-1.pooler.supabase.com
DB_PORT=6543
DB_USERNAME=postgres.xxxxxxxxxxxxx
DB_PASSWORD=ваш_пароль
DB_DATABASE=postgres
DB_SSL=true

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# File Upload
MAX_FILE_SIZE=5242880
MAX_NEWS_IMAGES=5
UPLOAD_DIR=./uploads
*/

// ============================================
// КРОК 4: src/common/config/multer.config.ts (НОВИЙ)
// ============================================

import { diskStorage } from 'multer';
import { extname } from 'path';
import { BadRequestException } from '@nestjs/common';

// Дозволені формати зображень
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

// Валідація типу файлу
export const imageFileFilter = (req: any, file: any, callback: any) => {
  if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    return callback(
      new BadRequestException(
        'Дозволені тільки зображення (JPEG, PNG, WebP)',
      ),
      false,
    );
  }
  callback(null, true);
};

// Генерація унікального імені файлу
const generateFileName = (req: any, file: any, callback: any) => {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  const ext = extname(file.originalname);
  const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
  callback(null, filename);
};

// Конфігурація для аватарів
export const avatarMulterConfig = {
  storage: diskStorage({
    destination: './uploads/avatars',
    filename: generateFileName,
  }),
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
};

// Конфігурація для зображень новин
export const newsImagesMulterConfig = {
  storage: diskStorage({
    destination: './uploads/news',
    filename: generateFileName,
  }),
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 5, // Максимум 5 файлів
  },
};

// ============================================
// КРОК 5: src/main.ts (ОНОВЛЕНО - додати статичні файли)
// ============================================

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // CORS
  app.enableCors();
  
  // Префікс для API
  app.setGlobalPrefix('api');
  
  // Статичні файли для зображень
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });
  
  // Валідація
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  
  // Swagger конфігурація
  const config = new DocumentBuilder()
    .setTitle('News Portal API')
    .setDescription('API документація для порталу новин')
    .setVersion('1.0')
    .addTag('auth', 'Аутентифікація та реєстрація')
    .addTag('users', 'Керування користувачами')
    .addTag('news', 'Керування новинами')
    .addTag('upload', 'Завантаження файлів')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Введіть JWT токен',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log('🚀 Сервер запущено на http://localhost:' + port);
  console.log('📰 API новин: http://localhost:' + port + '/api/news');
  console.log('📚 Swagger: http://localhost:' + port + '/api/docs');
  console.log('🖼️  Зображення: http://localhost:' + port + '/uploads/');
}
bootstrap();

// ============================================
// КРОК 6: src/users/users.controller.ts (ОНОВЛЕНО)
// ============================================

import { 
  Controller, 
  Get, 
  Put, 
  Body, 
  UseGuards, 
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth, 
  ApiParam,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { avatarMulterConfig } from '../common/config/multer.config';

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

  @Post('me/avatar')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @UseInterceptors(FileInterceptor('avatar', avatarMulterConfig))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Завантажити аватар' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        avatar: {
          type: 'string',
          format: 'binary',
          description: 'Файл аватара (JPEG, PNG, WebP, макс 5MB)',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Аватар завантажено' })
  @ApiResponse({ status: 400, description: 'Невалідний файл' })
  @ApiResponse({ status: 401, description: 'Не авторизований' })
  async uploadAvatar(
    @CurrentUser() user: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Файл не завантажено');
    }

    const avatarUrl = `/uploads/avatars/${file.filename}`;
    return await this.usersService.updateProfile(user.id, { 
      avatar: avatarUrl 
    });
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

// ============================================
// КРОК 7: src/news/entities/news.entity.ts (ОНОВЛЕНО)
// ============================================

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('news')
export class News {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 80 })
  title: string;

  @Column({ type: 'text' })
  excerpt: string;

  @Column({ type: 'varchar', length: 255 })
  content: string;

  // Тепер це масив URL зображень
  @Column({ type: 'text', array: true, default: [] })
  images: string[];

  @ManyToOne(() => User, (user) => user.news, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

// ============================================
// КРОК 8: SQL для оновлення таблиці news
// Виконайте в Supabase SQL Editor
// ============================================

/*
-- Видаляємо стару колонку image
ALTER TABLE news DROP COLUMN IF EXISTS image;

-- Додаємо нову колонку images як масив
ALTER TABLE news ADD COLUMN images TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Перевірка
SELECT * FROM news LIMIT 1;
*/

// ============================================
// КРОК 9: src/news/dto/create-news.dto.ts (ОНОВЛЕНО)
// ============================================

import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
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
}

// ============================================
// КРОК 10: src/news/news.controller.ts (ОНОВЛЕНО)
// ============================================

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
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth, 
  ApiParam,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { newsImagesMulterConfig } from '../common/config/multer.config';

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
  @UseInterceptors(FilesInterceptor('images', 5, newsImagesMulterConfig))
  @ApiConsumes('multipart/form-data')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Створити нову новину з зображеннями' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', maxLength: 80 },
        excerpt: { type: 'string' },
        content: { type: 'string', maxLength: 255 },
        images: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
          description: 'До 5 зображень (JPEG, PNG, WebP, кожне до 5MB)',
        },
      },
      required: ['title', 'excerpt', 'content'],
    },
  })
  @ApiResponse({ status: 201, description: 'Новина створена' })
  @ApiResponse({ status: 401, description: 'Не авторизований' })
  @ApiResponse({ status: 400, description: 'Невалідні дані або файли' })
  async create(
    @Body() createNewsDto: CreateNewsDto,
    @UploadedFiles() files: Express.Multer.File[],
    @CurrentUser() user: any,
  ) {
    const imageUrls = files?.map(file => `/uploads/news/${file.filename}`) || [];
    return await this.newsService.create(createNewsDto, user.id, imageUrls);
  }

  @Post(':id/images')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @UseInterceptors(FilesInterceptor('images', 5, newsImagesMulterConfig))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Додати зображення до існуючої новини' })
  @ApiParam({ name: 'id', description: 'UUID новини' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        images: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
          description: 'Зображення для додавання (макс 5 на новину)',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Зображення додано' })
  @ApiResponse({ status: 400, description: 'Перевищено ліміт зображень' })
  async addImages(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @CurrentUser() user: any,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Файли не завантажено');
    }

    const imageUrls = files.map(file => `/uploads/news/${file.filename}`);
    return await this.newsService.addImages(id, imageUrls, user.id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Оновити новину (без зображень)' })
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

  @Delete(':id/images/:filename')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Видалити конкретне зображення з новини' })
  @ApiParam({ name: 'id', description: 'UUID новини' })
  @ApiParam({ name: 'filename', description: 'Назва файлу зображення' })
  @ApiResponse({ status: 200, description: 'Зображення видалено' })
  async removeImage(
    @Param('id') id: string,
    @Param('filename') filename: string,
    @CurrentUser() user: any,
  ) {
    return await this.newsService.removeImage(id, filename, user.id);
  }
}

// ============================================
// КРОК 11: src/news/news.service.ts (ОНОВЛЕНО)
// ============================================

import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { News } from './entities/news.entity';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private newsRepository: Repository<News>,
  ) {}

  async findAll(): Promise<any[]> {
    const news = await this.newsRepository.find({
      order: { createdAt: 'DESC' },
      relations: ['user'],
    });

    return news.map(item => ({
      id: item.id,
      title: item.title,
      excerpt: item.excerpt,
      content: item.content,
      images: item.images,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      user: {
        id: item.user.id,
        firstName: item.user.firstName,
        lastName: item.user.lastName,
      },
    }));
  }

  async findOne(id: string): Promise<any> {
    const news = await this.newsRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!news) {
      throw new NotFoundException(`Новину з ID ${id} не знайдено`);
    }

    return {
      id: news.id,
      title: news.title,
      excerpt: news.excerpt,
      content: news.content,
      images: news.images,
      createdAt: news.createdAt,
      updatedAt: news.updatedAt,
      user: {
        id: news.user.id,
        firstName: news.user.firstName,
        lastName: news.user.lastName,
      },
    };
  }

  async create(
    createNewsDto: CreateNewsDto,
    userId: string,
    imageUrls: string[],
  ): Promise<any> {
    const news = this.newsRepository.create({
      ...createNewsDto,
      userId,
      images: imageUrls,
    });

    const savedNews = await this.newsRepository.save(news);
    
    const newsWithUser = await this.newsRepository.findOne({
      where: { id: savedNews.id },
      relations: ['user'],
    });

    return {
      id: newsWithUser.id,
      title: newsWithUser.title,
      excerpt: newsWithUser.excerpt,
      content: newsWithUser.content,
      images: newsWithUser.images,
      createdAt: newsWithUser.createdAt,
      updatedAt: newsWithUser.updatedAt,
      user: {
        id: newsWithUser.user.id,
        firstName: newsWithUser.user.firstName,
        lastName: newsWithUser.user.lastName,
      },
    };
  }

  async addImages(
    id: string,
    imageUrls: string[],
    userId: string,
  ): Promise<any> {
    const news = await this.newsRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!news) {
      throw new NotFoundException(`Новину з ID ${id} не знайдено`);
    }

    if (news.userId !== userId) {
      throw new ForbiddenException('Ви не можете редагувати цю новину');
    }

    const currentImagesCount = news.images?.length || 0;
    const newImagesCount = imageUrls.length;

    if (currentImagesCount + newImagesCount > 5) {
      throw new BadRequestException(
        `Максимум 5 зображень на новину. Зараз: ${currentImagesCount}, намагаєтесь додати: ${newImagesCount}`,
      );
    }

    news.images = [...(news.images || []), ...imageUrls];
    const updatedNews = await this.newsRepository.save(news);

    return {
      id: updatedNews.id,
      title: updatedNews.title,
      excerpt: updatedNews.excerpt,
      content: updatedNews.content,
      images: updatedNews.images,
      createdAt: updatedNews.createdAt,
      updatedAt: updatedNews.updatedAt,
      user: {
        id: news.user.id,
        firstName: news.user.firstName,
        lastName: news.user.lastName,
      },
    };
  }

  async removeImage(
    id: string,
    filename: string,
    userId: string,
  ): Promise<any> {
    const news = await this.newsRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!news) {
      throw new NotFoundException(`Новину з ID ${id} не знайдено`);
    }

    if (news.userId !== userId) {
      throw new ForbiddenException('Ви не можете редагувати цю новину');
    }

    const imageUrl = `/uploads/news/${filename}`;
    const imageIndex = news.images?.indexOf(imageUrl);

    if (imageIndex === -1 || imageIndex === undefined) {
      throw new NotFoundException('Зображення не знайдено в цій новині');
    }

    // Видаляємо файл з диска
    const filePath = path.join(process.cwd(), 'uploads', 'news', filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Видаляємо URL з масиву
    news.images.splice(imageIndex, 1);
    const updatedNews = await this.newsRepository.save(news);

    return {
      id: updatedNews.id,
      images: updatedNews.images,
      message: `Зображення ${filename} видалено`,
    };
  }

  async update(
    id: string,
    updateNewsDto: UpdateNewsDto,
    userId: string,
  ): Promise<any> {
    const news = await this.newsRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!news) {
      throw new NotFoundException(`Новину з ID ${id} не знайдено`);
    }

    if (news.userId !== userId) {
      throw new ForbiddenException('Ви не можете редагувати цю новину');
    }

    Object.assign(news, updateNewsDto);
    const updatedNews = await this.newsRepository.save(news);

    return {
      id: updatedNews.id,
      title: updatedNews.title,
      excerpt: updatedNews.excerpt,
      content: updatedNews.content,
      images: updatedNews.images,
      createdAt: updatedNews.createdAt,
      updatedAt: updatedNews.updatedAt,
      user: {
        id: news.user.id,
        firstName: news.user.firstName,
        lastName: news.user.lastName,
      },
    };
  }

  async remove(id: string, userId: string): Promise<{ message: string }> {
    const news = await this.newsRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!news) {
      throw new NotFoundException(`Новину з ID ${id} не знайдено`);
    }

    if (news.userId !== userId) {
      throw new ForbiddenException('Ви не можете видалити цю новину');
    }

    // Видаляємо всі зображення з диска
    if (news.images && news.images.length > 0) {
      news.images.forEach(imageUrl => {
        const filename = imageUrl.split('/').pop();
        const filePath = path.join(process.cwd(), 'uploads', 'news', filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }

    await this.newsRepository.remove(news);

    return { message: `Новину "${news.title}" успішно видалено` };
  }
}

// ============================================
// ТЕСТУВАННЯ
// ============================================

/*
1. Створіть папки:
   mkdir uploads
   mkdir uploads/avatars
   mkdir uploads/news

2. Оновіть SQL в Supabase (видалити image, додати images)

3. Перезапустіть сервер:
   npm run start:dev

4. Тестування в Swagger (http://localhost:3000/api/docs):

   a) Завантажити аватар:
      POST /api/users/me/avatar
      - Авторизуйтесь (Authorize)
      - Try it out
      - Виберіть файл
      - Execute

   b) Створити новину з зображеннями:
      POST /api/news
      - Авторизуйтесь
      - Заповніть: title, excerpt, content
      - Виберіть до 5 зображень
      - Execute

   c) Додати зображення до новини:
      POST /api/news/{id}/images
      - Вставте ID новини
      - Виберіть файли
      - Execute

   d) Видалити зображення: