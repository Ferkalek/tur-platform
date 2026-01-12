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
  ApiParam,
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
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Створити нову новину' })
  @ApiResponse({ status: 201, description: 'Новина створена' })
  @ApiResponse({ status: 401, description: 'Не авторизований' })
  @ApiResponse({ status: 400, description: 'Невалідні дані' })
  async create(
    @Body() createNewsDto: CreateNewsDto,
    @CurrentUser() user: User,
  ): Promise<ResponseBaseNewsDto> {
    return await this.newsService.create(createNewsDto, user.id);
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
}
