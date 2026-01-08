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
import { NewsService } from './news.service';
import {
  CreateNewsDto,
  ResponseNewsDto,
  ResponseBaseNewsDto,
  UpdateNewsDto,
} from './dto';
import { News } from './entities/news.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  // GET /api/news - get all news items
  @Get()
  async findAll(): Promise<ResponseNewsDto[]> {
    return await this.newsService.findAll();
  }

  // GET /api/news/user/:userId - get news items by user ID
  @Get('user/:userId')
  async findByUserId(@Param('userId') userId: string): Promise<any[]> {
    return await this.newsService.findByUserId(userId);
  }

  // GET /api/news/:id - get one news item by id
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ResponseNewsDto> {
    return await this.newsService.findOne(id);
  }

  // POST /api/news - create a news item
  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createNewsDto: CreateNewsDto,
    @CurrentUser() user: User,
  ): Promise<ResponseBaseNewsDto> {
    return await this.newsService.create(createNewsDto, user.id);
  }

  // PUT /api/news/:id - update a news item
  @Put(':id')
  @UseGuards(JwtAuthGuard)
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
  @HttpCode(HttpStatus.OK)
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<{ message: string }> {
    return await this.newsService.remove(id, user.id);
  }
}
