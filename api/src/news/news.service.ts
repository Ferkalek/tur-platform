import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { News } from './interface/news.interface';

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
