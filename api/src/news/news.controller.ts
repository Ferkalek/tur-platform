import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { News } from './interface/news.interface';

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
  create(@Body() createNewsDto: CreateNewsDto): Promise<News> {
    return this.newsService.create(createNewsDto);
  }

  // PUT /api/news/:id - update a news item
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateNewsDto: UpdateNewsDto,
  ): Promise<any> {
    return this.newsService.update(id, updateNewsDto);
  }

  // DELETE /api/news/:id - delete a news item
  @Delete(':id')
  remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.newsService.remove(id);
  }
}
