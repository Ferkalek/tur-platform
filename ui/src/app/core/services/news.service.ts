import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { News } from '../models/news.model';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private mockNews: News[] = [
    {
      id: '1',
      title: 'Angular 19 випущено',
      excerpt: 'Нова версія Angular приносить покращення продуктивності та нові можливості.',
      content: 'Повний текст новини...',
      image: 'https://picsum.photos/400/300?random=1',
      date: new Date('2025-01-15'),
      author: 'Angular Team',
    },
    {
      id: '2',
      title: 'Standalone Components стали стандартом',
      excerpt: 'Модульний підхід поступається місцем standalone компонентам.',
      content: 'Повний текст новини...',
      image: 'https://picsum.photos/400/300?random=2',
      date: new Date('2025-01-10'),
      author: 'Dev Community',
    },
    {
      id: '3',
      title: 'Сигнали в Angular: революція в реактивності',
      excerpt: 'Нова система сигналів змінює підхід до управління станом.',
      content: 'Повний текст новини...',
      image: 'https://picsum.photos/400/300?random=3',
      date: new Date('2025-01-05'),
      author: 'Tech Blog',
    },
  ];

  getNews(): Observable<News[]> {
    return of(this.mockNews).pipe(delay(500));
  }

  getNewsById(id: string): Observable<News | undefined> {
    return of(this.mockNews.find((n) => n.id === id)).pipe(delay(300));
  }
}
