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
import {
  CreateNewsDto,
  ResponseNewsDto,
  ResponseBaseNewsDto,
  UpdateNewsDto,
} from './dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { newsImagesMulterConfig } from '../config/multer.config';

@ApiTags('news')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  // GET /api/news - get all news items
  @Get()
  @ApiOperation({ summary: 'Отримати всі новини' })
  @ApiResponse({
    status: 200,
    description: 'Список всіх опублікованих новин',
  })
  async findAll(): Promise<ResponseNewsDto[]> {
    return await this.newsService.findAll();
  }

  // GET /api/news/user/:userId - get news items by user ID
  @Get('user/:userId')
  @UseGuards(JwtAuthGuard)
  async findByUserId(@Param('userId') userId: string): Promise<any[]> {
    return await this.newsService.findByUserId(userId);
  }

  // GET /api/news/:id - get one news item by id
  @Get(':id')
  @ApiOperation({ summary: 'Отримати новину за ID' })
  @ApiParam({ name: 'id', description: 'UUID новини' })
  @ApiResponse({ status: 200, description: 'Новина знайдена' })
  @ApiResponse({ status: 404, description: 'Новину не знайдено' })
  async findOne(@Param('id') id: string): Promise<ResponseNewsDto> {
    return await this.newsService.findOne(id);
  }

  // POST /api/news - create a news item
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @UseInterceptors(FilesInterceptor('images', 5, newsImagesMulterConfig))
  @ApiConsumes('multipart/form-data')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Створити нову новину' })
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
  @ApiResponse({ status: 400, description: 'Невалідні дані' })
  async create(
    @Body() createNewsDto: CreateNewsDto,
    @UploadedFiles() files: Express.Multer.File[],
    @CurrentUser() user: User,
  ): Promise<ResponseBaseNewsDto> {
    const imageUrls =
      files?.map((file) => `/uploads/news/${file.filename}`) || [];
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
    @CurrentUser() user: User,
  ): Promise<ResponseBaseNewsDto> {
    if (!files || files.length === 0) {
      throw new BadRequestException('Файли не завантажено');
    }

    const imageUrls = files.map((file) => `/uploads/news/${file.filename}`);
    return await this.newsService.addImages(id, imageUrls, user.id);
  }

  // PUT /api/news/:id - update a news item
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
    @CurrentUser() user: User,
  ): Promise<ResponseBaseNewsDto> {
    return await this.newsService.update(id, updateNewsDto, user.id);
  }

  // DELETE /api/news/:id - delete a news item
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
  @HttpCode(HttpStatus.OK)
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<{ message: string }> {
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
    @CurrentUser() user: User,
  ): Promise<{ id: string; images: string[]; message: string }> {
    return await this.newsService.removeImage(id, filename, user.id);
  }
}
