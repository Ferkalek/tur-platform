import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { News } from './entities/news.entity';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private newsRepository: Repository<News>,
  ) {}

  // GET all news
  async findAll(): Promise<News[]> {
    return await this.newsRepository.find({
      order: { createdAt: 'DESC' },
      relations: ['user'],
    });
  }

  // GET one news item by ID
  async findOne(id: string): Promise<News> {
    const news = await this.newsRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!news) {
      throw new NotFoundException(`News with ID ${id} not found`);
    }

    return news;
  }

  // POST create news
  async create(createNewsDto: CreateNewsDto, userId: string): Promise<News> {
    const news = this.newsRepository.create({
      ...createNewsDto,
      userId,
    });

    return await this.newsRepository.save(news);
  }

  // PUT/PATCH update news
  async update(
    id: string,
    updateNewsDto: UpdateNewsDto,
    userId: string,
  ): Promise<News> {
    const news = await this.findOne(id);

    if (news.userId !== userId) {
      throw new ForbiddenException('You are not allowed to update this news');
    }

    Object.assign(news, updateNewsDto);

    return await this.newsRepository.save(news);
  }

  // DELETE delete news
  async remove(id: string, userId: string): Promise<{ message: string }> {
    const news = await this.findOne(id);

    if (news.userId !== userId) {
      throw new ForbiddenException('You are not allowed to delete this news');
    }

    await this.newsRepository.remove(news);

    return { message: `News "${news.title}" was deleted successfully` };
  }
}
