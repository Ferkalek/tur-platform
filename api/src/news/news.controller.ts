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
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { News } from './entities/news.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  // GET /api/news - get all news items
  @Get()
  findAll(): Promise<News[]> {
    return this.newsService.findAll();
  }

  // GET /api/news/:id - get one news item by id
  @Get(':id')
  findOne(@Param('id') id: string): Promise<News> {
    return this.newsService.findOne(id);
  }

  // POST /api/news - create a news item
  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createNewsDto: CreateNewsDto,
    @CurrentUser() user: any,
  ): Promise<News> {
    return this.newsService.create(createNewsDto, user.id);
  }

  // PUT /api/news/:id - update a news item
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateNewsDto: UpdateNewsDto,
    @CurrentUser() user: any,
  ): Promise<any> {
    return this.newsService.update(id, updateNewsDto, user.id);
  }

  // DELETE /api/news/:id - delete a news item
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  remove(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ): Promise<{ message: string }> {
    return this.newsService.remove(id, user.id);
  }
}
