import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { News } from '../models';
import { API_BASE_URL, NEWS_ENDPOINT } from '../const';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private http = inject(HttpClient);

  getNews(): Observable<News[]> {
    return this.http.get<News[]>(`${API_BASE_URL}${NEWS_ENDPOINT}`);
  }

  getNewsById(id: string): Observable<News> {
    return this.http.get<News>(`${API_BASE_URL}${NEWS_ENDPOINT}/${id}`);
  }

  createNews(news: Partial<News>): Observable<News> {
    return this.http.post<News>(`${API_BASE_URL}${NEWS_ENDPOINT}`, news);
  }

  updateNews(id: string, news: Partial<News>): Observable<News> {
    return this.http.put<News>(`${API_BASE_URL}${NEWS_ENDPOINT}/${id}`, news);
  }

  deleteNews(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${API_BASE_URL}${NEWS_ENDPOINT}/${id}`);
  }
}
