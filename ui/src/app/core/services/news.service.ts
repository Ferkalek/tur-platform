import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { News } from '../models';
import { NEWS_ENDPOINT } from '../const';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private http = inject(HttpClient);

  getNews(): Observable<News[]> {
    return this.http.get<News[]>(NEWS_ENDPOINT);
  }

  getNewsById(id: string): Observable<News> {
    return this.http.get<News>(`${NEWS_ENDPOINT}/${id}`);
  }

  getUserNews(userId: string): Observable<News[]> {
    return this.http.get<News[]>(`${NEWS_ENDPOINT}/user/${userId}`);
  }

  createNews(news: Partial<News>): Observable<News> {
    return this.http.post<News>(NEWS_ENDPOINT, news);
  }

  updateNews(id: string, news: Partial<News>): Observable<News> {
    return this.http.put<News>(`${NEWS_ENDPOINT}/${id}`, news);
  }

  addImages(id: string, files: File[]): Observable<any> {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append('images', file, file.name);
    });

    return this.http.post<any>(`${NEWS_ENDPOINT}/${id}/images`, formData);
  }

  deleteNews(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${NEWS_ENDPOINT}/${id}`);
  }
}
