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

  deleteNews(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${NEWS_ENDPOINT}/${id}`);
  }

  addImages(id: string, files: File[]): Observable<News> {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append('images', file, file.name);
    });

    return this.http.post<News>(`${this.imgUrl(id)}`, formData);
  }

  deleteImage(id: string, imageUrl: string): Observable<any> {
    return this.http.delete<any>(`${this.imgUrl(id)}`, {
      body: { imageUrl }
    });
  }

  // images change order
  reorderNewsImages(id: string, imageUrls: string[]): Observable<News> {
    return this.http.put<News>(`${this.imgUrl(id)}/reorder`, { imageUrls });
  }

  // set up main image
  setCoverImage(id: string, imageUrl: string): Observable<News> {
    return this.http.put<News>(`${this.imgUrl(id)}/cover-image`, { imageUrl });
  }

  private imgUrl(imageId: string): string {
    return `${NEWS_ENDPOINT}/${imageId}/images`;
  }
}
