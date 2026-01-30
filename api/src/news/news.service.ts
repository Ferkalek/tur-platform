import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { News } from './entities/news.entity';
import {
  CreateNewsDto,
  UpdateNewsDto,
  ResponseNewsDto,
  ResponseBaseNewsDto,
} from './dto';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private newsRepository: Repository<News>,
  ) {}

  // GET all news
  async findAll(): Promise<ResponseNewsDto[]> {
    const news = await this.newsRepository.find({
      order: { createdAt: 'DESC' },
      relations: ['user'],
    });

    return news.map((item) => this.mapToResponseNews(item));
  }

  // GET news by user ID
  async findByUserId(userId: string): Promise<ResponseBaseNewsDto[]> {
    const news = await this.newsRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      relations: ['user'],
    });

    if (!news) {
      throw new NotFoundException(`News for user with ID ${userId} not found`);
    }

    return news.map((item) => this.mapToBaseNews(item));
  }

  // GET one news item by ID
  async findOne(id: string): Promise<ResponseNewsDto> {
    const news = await this.newsRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!news) {
      throw new NotFoundException(`News with ID ${id} not found`);
    }

    return this.mapToResponseNews(news);
  }

  // POST create news
  async create(
    createNewsDto: CreateNewsDto,
    userId: string,
    imageUrls: string[],
  ): Promise<ResponseBaseNewsDto> {
    const news = this.newsRepository.create({
      ...createNewsDto,
      userId,
      images: imageUrls,
    });

    const res = await this.newsRepository.save(news);

    // just in case
    // const newsWithUser = await this.newsRepository.findOne({
    //   where: { id: savedNews.id },
    //   relations: ['user'],
    // });

    return this.mapToBaseNews(res);
  }

  async addImages(
    id: string,
    imageUrls: string[],
    userId: string,
  ): Promise<ResponseBaseNewsDto> {
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
    const res = await this.newsRepository.save(news);

    return this.mapToBaseNews(res);
  }

  async removeImage(
    id: string,
    imageUrl: string,
    userId: string,
  ): Promise<{ id: string; images: string[]; message: string }> {
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

    console.log('.......... imageUrl', imageUrl);
    const imageIndex = news.images?.indexOf(imageUrl);

    if (imageIndex === -1 || imageIndex === undefined) {
      throw new NotFoundException('Зображення не знайдено в цій новині');
    }

    // Видаляємо файл з диска
    const filePath = path.join(process.cwd(), imageUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Видаляємо URL з масиву
    news.images.splice(imageIndex, 1);
    const updatedNews = await this.newsRepository.save(news);

    return {
      id: updatedNews.id,
      images: updatedNews.images,
      message: `Зображення ${imageUrl} видалено`,
    };
  }

  // PUT/PATCH update news
  async update(
    id: string,
    updateNewsDto: UpdateNewsDto,
    userId: string,
  ): Promise<ResponseBaseNewsDto> {
    const news = await this.findOneNews(id);

    if (news.userId !== userId) {
      throw new ForbiddenException('You are not allowed to update this news');
    }

    console.log('.......... updateNewsDto', updateNewsDto);
    Object.assign(news, updateNewsDto);

    const res = await this.newsRepository.save(news);

    return this.mapToBaseNews(res);
  }

  // DELETE delete news
  async remove(id: string, userId: string): Promise<{ message: string }> {
    const news = await this.findOneNews(id);

    if (news.userId !== userId) {
      throw new ForbiddenException('You are not allowed to delete this news');
    }

    // Видаляємо всі зображення з диска
    if (news.images && news.images.length > 0) {
      news.images.forEach((imageUrl) => {
        const filename = imageUrl.split('/').pop() as string;
        const filePath = path.join(process.cwd(), 'uploads', 'news', filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }

    await this.newsRepository.remove(news);

    return { message: `News "${news.title}" was deleted successfully` };
  }

  private async findOneNews(id: string): Promise<News> {
    const news = await this.newsRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!news) {
      throw new NotFoundException(`News with ID ${id} not found`);
    }

    return news;
  }

  private mapToResponseNews(news: News): ResponseNewsDto {
    return {
      ...news,
      user: {
        id: news.userId,
        firstName: news.user.firstName,
        lastName: news.user.lastName,
      },
    };
  }

  private mapToBaseNews(news: News): ResponseBaseNewsDto {
    const {
      id,
      title,
      excerpt,
      content,
      images,
      userId,
      createdAt,
      updatedAt,
    } = news;

    return {
      id,
      title,
      excerpt,
      content,
      images,
      userId,
      createdAt,
      updatedAt,
    };
  }
}
