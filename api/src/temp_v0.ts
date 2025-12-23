// ============================================
// СТРУКТУРА ПРОЕКТУ
// ============================================

/*
news-api/
├── src/
│   ├── news/
│   │   ├── dto/
│   │   │   ├── create-news.dto.ts
│   │   │   └── update-news.dto.ts
│   │   ├── news.controller.ts
│   │   ├── news.service.ts
│   │   └── news.module.ts
│   ├── app.module.ts
│   └── main.ts
├── data/
│   └── news.json
├── package.json
└── tsconfig.json
*/

// ============================================
// src/main.ts
// ============================================

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Дозволяємо CORS для фронтенду
  app.enableCors();
  
  // Префікс для всіх роутів
  app.setGlobalPrefix('api');
  
  // Валідація даних
  app.useGlobalPipes(new ValidationPipe());
  
  await app.listen(3000);
  console.log('🚀 Сервер запущено на http://localhost:3000');
  console.log('📰 API новин: http://localhost:3000/api/news');
}
bootstrap();

// ============================================
// src/app.module.ts
// ============================================

import { Module } from '@nestjs/common';
import { NewsModule } from './news/news.module';

@Module({
  imports: [NewsModule],
})
export class AppModule {}

// ============================================
// src/news/news.module.ts
// ============================================

import { Module } from '@nestjs/common';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';

@Module({
  controllers: [NewsController],
  providers: [NewsService],
})
export class NewsModule {}

// ============================================
// src/news/news.service.ts
// ============================================

import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';

interface News {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  author: string;
}

@Injectable()
export class NewsService {
  private readonly dataPath = path.join(process.cwd(), 'data', 'news.json');

  // Ініціалізація файлу з даними при старті
  async onModuleInit() {
    try {
      await fs.access(this.dataPath);
    } catch {
      // Файл не існує, створюємо з початковими даними
      await this.initializeData();
    }
  }

  // Створюємо початкові дані
  private async initializeData() {
    const initialNews: News[] = [
      {
        id: '1',
        title: 'Нові технології в веб-розробці 2025',
        excerpt: 'Огляд найважливіших трендів та інструментів для сучасних розробників',
        content: 'У 2025 році веб-розробка досягла нових висот. React Server Components стали стандартом, TypeScript повністю витіснив JavaScript у корпоративному секторі. Edge computing та serverless архітектури тепер доступні всім.',
        image: 'https://picsum.photos/800/400?random=1',
        date: new Date().toISOString(),
        author: 'Іван Петренко',
      },
      {
        id: '2',
        title: 'Штучний інтелект змінює індустрію',
        excerpt: 'Як AI допомагає розробникам писати код швидше та якісніше',
        content: 'Сучасні AI-асистенти не просто автодоповнюють код - вони розуміють контекст проекту, пропонують оптимальні рішення і навіть можуть рефакторити застарілий код. GitHub Copilot, Claude та інші інструменти стали невід\'ємною частиною розробки.',
        image: 'https://picsum.photos/800/400?random=2',
        date: new Date(Date.now() - 86400000).toISOString(), // Вчора
        author: 'Марія Коваленко',
      },
      {
        id: '3',
        title: 'Backend розробка: найкращі практики',
        excerpt: 'Від монолітів до мікросервісів - еволюція серверної архітектури',
        content: 'NestJS став лідером серед Node.js фреймворків завдяки своїй модульності та TypeScript-first підходу. Microservices, event-driven архітектура та clean code - це вже не тренди, а стандарт індустрії.',
        image: 'https://picsum.photos/800/400?random=3',
        date: new Date(Date.now() - 172800000).toISOString(), // 2 дні тому
        author: 'Олександр Шевченко',
      },
    ];

    const dir = path.dirname(this.dataPath);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(this.dataPath, JSON.stringify(initialNews, null, 2));
  }

  // Читаємо всі новини з файлу
  private async readNews(): Promise<News[]> {
    const data = await fs.readFile(this.dataPath, 'utf-8');
    return JSON.parse(data);
  }

  // Записуємо новини у файл
  private async writeNews(news: News[]): Promise<void> {
    await fs.writeFile(this.dataPath, JSON.stringify(news, null, 2));
  }

  // GET - отримати всі новини
  async findAll(): Promise<News[]> {
    return await this.readNews();
  }

  // GET - отримати одну новину за ID
  async findOne(id: string): Promise<News> {
    const news = await this.readNews();
    const item = news.find((n) => n.id === id);
    
    if (!item) {
      throw new NotFoundException(`Новину з ID ${id} не знайдено`);
    }
    
    return item;
  }

  // POST - створити нову новину
  async create(createNewsDto: CreateNewsDto): Promise<News> {
    const news = await this.readNews();
    
    const newItem: News = {
      id: Date.now().toString(),
      ...createNewsDto,
      date: new Date().toISOString(),
    };
    
    news.unshift(newItem); // Додаємо на початок масиву
    await this.writeNews(news);
    
    return newItem;
  }

  // PUT/PATCH - оновити новину
  async update(id: string, updateNewsDto: UpdateNewsDto): Promise<News> {
    const news = await this.readNews();
    const index = news.findIndex((n) => n.id === id);
    
    if (index === -1) {
      throw new NotFoundException(`Новину з ID ${id} не знайдено`);
    }
    
    news[index] = { ...news[index], ...updateNewsDto };
    await this.writeNews(news);
    
    return news[index];
  }

  // DELETE - видалити новину
  async remove(id: string): Promise<{ message: string }> {
    const news = await this.readNews();
    const index = news.findIndex((n) => n.id === id);
    
    if (index === -1) {
      throw new NotFoundException(`Новину з ID ${id} не знайдено`);
    }
    
    news.splice(index, 1);
    await this.writeNews(news);
    
    return { message: `Новину ${id} успішно видалено` };
  }
}

// ============================================
// src/news/news.controller.ts
// ============================================

import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  // GET /api/news - отримати всі новини
  @Get()
  findAll() {
    return this.newsService.findAll();
  }

  // GET /api/news/:id - отримати одну новину
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newsService.findOne(id);
  }

  // POST /api/news - створити нову новину
  @Post()
  create(@Body() createNewsDto: CreateNewsDto) {
    return this.newsService.create(createNewsDto);
  }

  // PUT /api/news/:id - оновити новину
  @Put(':id')
  update(@Param('id') id: string, @Body() updateNewsDto: UpdateNewsDto) {
    return this.newsService.update(id, updateNewsDto);
  }

  // DELETE /api/news/:id - видалити новину
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.newsService.remove(id);
  }
}

// ============================================
// src/news/dto/create-news.dto.ts
// ============================================

import { IsString, IsNotEmpty, MaxLength, IsUrl } from 'class-validator';

export class CreateNewsDto {
  @IsString()
  @IsNotEmpty({ message: 'Заголовок обов\'язковий' })
  @MaxLength(80, { message: 'Заголовок не може бути довше 80 символів' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Короткий опис обов\'язковий' })
  excerpt: string;

  @IsString()
  @IsNotEmpty({ message: 'Контент обов\'язковий' })
  @MaxLength(255, { message: 'Контент не може бути довше 255 символів' })
  content: string;

  @IsString()
  @IsUrl({}, { message: 'Невалідна URL адреса зображення' })
  image: string;

  @IsString()
  @IsNotEmpty({ message: 'Автор обов\'язковий' })
  author: string;
}

// ============================================
// src/news/dto/update-news.dto.ts
// ============================================

import { IsString, IsOptional, MaxLength, IsUrl } from 'class-validator';

export class UpdateNewsDto {
  @IsString()
  @IsOptional()
  @MaxLength(80)
  title?: string;

  @IsString()
  @IsOptional()
  excerpt?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  content?: string;

  @IsString()
  @IsOptional()
  @IsUrl()
  image?: string;

  @IsString()
  @IsOptional()
  author?: string;
}

// ============================================
// package.json
// ============================================

/*
{
  "name": "news-api",
  "version": "1.0.0",
  "scripts": {
    "start": "nest start",
    "start:dev": "nest start --watch",
    "build": "nest build"
  },
  "dependencies": {
    "@nestjs/common": "^10.3.0",
    "@nestjs/core": "^10.3.0",
    "@nestjs/platform-express": "^10.3.0",
    "class-validator": "^0.14.0",
    "class-transformer": "^0.5.1",
    "reflect-metadata": "^0.2.1",
    "rxjs": "^7.8.1"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.3.0",
    "@types/node": "^20.11.0",
    "typescript": "^5.3.3"
  }
}
*/

// ============================================
// ІНСТРУКЦІЯ ПО ЗАПУСКУ
// ============================================

/*
1. Створити папку проекту:
   mkdir news-api
   cd news-api

2. Встановити NestJS CLI глобально:
   npm install -g @nestjs/cli

3. Створити новий проект:
   nest new news-api
   
   Або якщо nest CLI не встановлений:
   npm init -y
   npm install @nestjs/common @nestjs/core @nestjs/platform-express class-validator class-transformer reflect-metadata rxjs
   npm install -D @nestjs/cli @types/node typescript

4. Скопіювати всі файли з артефакту у відповідні папки

5. Запустити проект:
   npm run start:dev

6. Перевірити роботу:
   Відкрити http://localhost:3000/api/news у браузері

7. Тестування API через curl або Postman:

   # Отримати всі новини
   GET http://localhost:3000/api/news

   # Отримати одну новину
   GET http://localhost:3000/api/news/1

   # Створити нову новину
   POST http://localhost:3000/api/news
   Body (JSON):
   {
     "title": "Моя нова стаття",
     "excerpt": "Короткий опис",
     "content": "Контент статті до 255 символів",
     "image": "https://picsum.photos/800/400",
     "author": "Ваше Ім'я"
   }

   # Оновити новину
   PUT http://localhost:3000/api/news/1
   Body (JSON):
   {
     "title": "Оновлений заголовок"
   }

   # Видалити новину
   DELETE http://localhost:3000/api/news/1
*/