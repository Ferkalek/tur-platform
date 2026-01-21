// ========================================
// МОДЕЛЬ ДАНИХ
// ========================================

// 📁 src/app/core/models/news.model.ts (ОНОВЛЕНИЙ)
export interface News {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  images: string[];  // ✅ Масив URL зображень
  coverImage?: string;  // Головне зображення (опціонально)
  date: Date;
  author: string;
}

export interface ImageUploadResponse {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

export interface MultipleImagesUploadResponse {
  images: ImageUploadResponse[];
  totalSize: number;
  uploadedCount: number;
}

// ========================================
// СЕРВІС ДЛЯ РОБОТИ З НОВИНАМИ
// ========================================

// 📁 src/app/core/services/news.service.ts (ОНОВЛЕНИЙ)
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { News, ImageUploadResponse, MultipleImagesUploadResponse } from '../models/news.model';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private http = inject(HttpClient);

  getNews(): Observable<News[]> {
    return this.http.get<News[]>('news');
  }

  getNewsById(id: string): Observable<News> {
    return this.http.get<News>(`news/${id}`);
  }

  createNews(news: Partial<News>): Observable<News> {
    return this.http.post<News>('news', news);
  }

  updateNews(id: string, news: Partial<News>): Observable<News> {
    return this.http.put<News>(`news/${id}`, news);
  }

  deleteNews(id: string): Observable<void> {
    return this.http.delete<void>(`news/${id}`);
  }

  // ✅ МЕТОД 1: Завантаження одного зображення
  uploadNewsImage(file: File, newsId?: string): Observable<ImageUploadResponse> {
    const formData = new FormData();
    formData.append('image', file);
    
    if (newsId) {
      formData.append('newsId', newsId);
    }
    
    return this.http.post<ImageUploadResponse>('news/upload-image', formData);
  }

  // ✅ МЕТОД 2: Завантаження множини зображень
  uploadNewsImages(files: File[], newsId?: string): Observable<MultipleImagesUploadResponse> {
    const formData = new FormData();
    
    // Додаємо всі файли до FormData
    files.forEach((file, index) => {
      formData.append('images', file, file.name);
      // або formData.append(`images[${index}]`, file, file.name);
    });
    
    if (newsId) {
      formData.append('newsId', newsId);
    }
    
    return this.http.post<MultipleImagesUploadResponse>('news/upload-images', formData);
  }

  // ✅ МЕТОД 3: Завантаження з прогресом (для великих файлів)
  uploadNewsImagesWithProgress(
    files: File[], 
    newsId?: string
  ): Observable<{ progress: number; response?: MultipleImagesUploadResponse }> {
    const formData = new FormData();
    
    files.forEach((file) => {
      formData.append('images', file, file.name);
    });
    
    if (newsId) {
      formData.append('newsId', newsId);
    }
    
    return this.http.post<MultipleImagesUploadResponse>('news/upload-images', formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      map((event: HttpEvent<MultipleImagesUploadResponse>) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            const progress = event.total 
              ? Math.round((100 * event.loaded) / event.total)
              : 0;
            return { progress };
          
          case HttpEventType.Response:
            return { progress: 100, response: event.body || undefined };
          
          default:
            return { progress: 0 };
        }
      })
    );
  }

  // ✅ МЕТОД 4: Видалення зображення новини
  deleteNewsImage(newsId: string, imageUrl: string): Observable<void> {
    return this.http.delete<void>(`news/${newsId}/images`, {
      body: { imageUrl }
    });
  }

  // ✅ МЕТОД 5: Оновлення порядку зображень
  reorderNewsImages(newsId: string, imageUrls: string[]): Observable<News> {
    return this.http.put<News>(`news/${newsId}/images/reorder`, { imageUrls });
  }

  // ✅ МЕТОД 6: Встановлення головного зображення
  setCoverImage(newsId: string, imageUrl: string): Observable<News> {
    return this.http.put<News>(`news/${newsId}/cover-image`, { imageUrl });
  }
}

// ========================================
// КОМПОНЕНТ ДЛЯ СТВОРЕННЯ/РЕДАГУВАННЯ НОВИНИ
// ========================================

// 📁 src/app/features/news/news-form/news-form.component.ts
import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NewsService } from '../../../core/services/news.service';
import { ConfigService } from '../../../core/services/config.service';
import { News } from '../../../core/models/news.model';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { ImageModule } from 'primeng/image';
import { ProgressBarModule } from 'primeng/progressbar';
import { GalleriaModule } from 'primeng/galleria';

@Component({
  selector: 'app-news-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    FileUploadModule,
    ToastModule,
    CardModule,
    ImageModule,
    ProgressBarModule,
    GalleriaModule
  ],
  providers: [MessageService],
  template: `
    <div class="news-form-container">
      <p-toast />
      
      <h2>{{ isEditMode ? 'Редагування новини' : 'Створення новини' }}</h2>

      <form (ngSubmit)="onSubmit()" class="news-form">
        <p-card>
          <ng-template pTemplate="header">
            <div class="card-header">
              <h3>Основна інформація</h3>
            </div>
          </ng-template>

          <div class="form-field">
            <label for="title">Заголовок *</label>
            <input
              pInputText
              type="text"
              id="title"
              [(ngModel)]="news.title"
              name="title"
              placeholder="Введіть заголовок новини"
              required
            >
          </div>

          <div class="form-field">
            <label for="excerpt">Короткий опис *</label>
            <textarea
              pInputTextarea
              id="excerpt"
              [(ngModel)]="news.excerpt"
              name="excerpt"
              rows="3"
              placeholder="Короткий опис новини для превью"
              required
            ></textarea>
          </div>

          <div class="form-field">
            <label for="content">Контент *</label>
            <textarea
              pInputTextarea
              id="content"
              [(ngModel)]="news.content"
              name="content"
              rows="10"
              placeholder="Повний текст новини"
              required
            ></textarea>
          </div>
        </p-card>

        <p-card class="images-card">
          <ng-template pTemplate="header">
            <div class="card-header">
              <h3>Зображення</h3>
              <small>Ви можете завантажити до 10 зображень (макс. 5MB кожне)</small>
            </div>
          </ng-template>

          <!-- Завантаження файлів -->
          <div class="upload-section">
            <p-fileUpload
              #fileUpload
              name="images[]"
              [multiple]="true"
              accept="image/*"
              [maxFileSize]="5000000"
              [showUploadButton]="false"
              [showCancelButton]="false"
              chooseLabel="Вибрати зображення"
              chooseIcon="pi pi-images"
              (onSelect)="onImagesSelect($event)"
              (onRemove)="onImageRemove($event)"
              (onClear)="onClearImages()"
            >
              <ng-template pTemplate="content" let-files>
                @if (files.length > 0) {
                  <div class="preview-grid">
                    @for (file of files; track file.name) {
                      <div class="preview-item">
                        <img [src]="getFilePreview(file)" [alt]="file.name">
                        <div class="preview-info">
                          <small>{{ file.name }}</small>
                          <small>{{ formatFileSize(file.size) }}</small>
                        </div>
                      </div>
                    }
                  </div>
                }
              </ng-template>
            </p-fileUpload>

            @if (uploadProgress > 0 && uploadProgress < 100) {
              <p-progressBar [value]="uploadProgress" />
            }

            @if (selectedFiles.length > 0) {
              <div class="upload-actions">
                <p-button
                  label="Завантажити зображення"
                  icon="pi pi-cloud-upload"
                  [loading]="uploading"
                  (onClick)="uploadImages()"
                />
                <p-button
                  label="Очистити"
                  icon="pi pi-times"
                  severity="secondary"
                  [outlined]="true"
                  (onClick)="clearSelectedFiles()"
                  [disabled]="uploading"
                />
              </div>
            }
          </div>

          <!-- Завантажені зображення -->
          @if (news.images && news.images.length > 0) {
            <div class="uploaded-images">
              <h4>Завантажені зображення ({{ news.images.length }})</h4>
              
              <div class="images-grid">
                @for (image of news.images; track image; let i = $index) {
                  <div class="image-item" [class.cover]="image === news.coverImage">
                    <img [src]="config.getUploadUrl(image)" [alt]="'Image ' + (i + 1)">
                    
                    <div class="image-overlay">
                      <p-button
                        icon="pi pi-eye"
                        [rounded]="true"
                        severity="info"
                        (onClick)="viewImage(i)"
                        pTooltip="Переглянути"
                      />
                      
                      @if (image !== news.coverImage) {
                        <p-button
                          icon="pi pi-star"
                          [rounded]="true"
                          severity="warning"
                          (onClick)="setCoverImage(image)"
                          pTooltip="Встановити як головне"
                        />
                      } @else {
                        <span class="cover-badge">
                          <i class="pi pi-star-fill"></i>
                          Головне
                        </span>
                      }
                      
                      <p-button
                        icon="pi pi-trash"
                        [rounded]="true"
                        severity="danger"
                        (onClick)="deleteImage(image, i)"
                        pTooltip="Видалити"
                      />
                    </div>
                  </div>
                }
              </div>
            </div>
          }
        </p-card>

        <div class="form-actions">
          <p-button
            type="submit"
            [label]="isEditMode ? 'Оновити' : 'Створити'"
            icon="pi pi-check"
            [loading]="saving"
            [disabled]="saving || uploading"
          />
          
          <p-button
            type="button"
            label="Скасувати"
            icon="pi pi-times"
            severity="secondary"
            [outlined]="true"
            (onClick)="cancel()"
            [disabled]="saving || uploading"
          />
        </div>
      </form>

      <!-- Галерея для перегляду -->
      @if (displayGallery) {
        <p-galleria
          [(value)]="news.images"
          [(visible)]="displayGallery"
          [(activeIndex)]="activeImageIndex"
          [responsiveOptions]="responsiveOptions"
          [numVisible]="5"
          [circular]="true"
          [fullScreen]="true"
          [showItemNavigators]="true"
          [showThumbnails]="true"
        >
          <ng-template pTemplate="item" let-item>
            <img [src]="config.getUploadUrl(item)" style="width: 100%; display: block;">
          </ng-template>
          <ng-template pTemplate="thumbnail" let-item>
            <img [src]="config.getUploadUrl(item)" style="width: 100px; display: block;">
          </ng-template>
        </p-galleria>
      }
    </div>
  `,
  styles: [`
    .news-form-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    h2 {
      font-size: 2rem;
      margin-bottom: 2rem;
      color: var(--text-primary, #333);
    }

    .news-form {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .card-header {
      padding: 1.5rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;

      h3 {
        margin: 0 0 0.5rem 0;
        font-size: 1.25rem;
      }

      small {
        opacity: 0.9;
      }
    }

    .form-field {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 1.5rem;

      label {
        font-weight: 600;
        color: var(--text-primary, #333);
      }
    }

    .upload-section {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .preview-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }

    .preview-item {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      border: 1px solid var(--border-color, #e0e0e0);
      border-radius: 8px;
      padding: 0.5rem;

      img {
        width: 100%;
        height: 150px;
        object-fit: cover;
        border-radius: 4px;
      }

      .preview-info {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;

        small {
          color: var(--text-secondary, #666);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }

    .upload-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
    }

    .uploaded-images {
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 2px solid var(--border-color, #e0e0e0);

      h4 {
        margin-bottom: 1rem;
        color: var(--text-primary, #333);
      }
    }

    .images-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1rem;
    }

    .image-item {
      position: relative;
      aspect-ratio: 16/9;
      border-radius: 8px;
      overflow: hidden;
      border: 2px solid transparent;
      transition: all 0.3s;

      &.cover {
        border-color: var(--warning-color, #ff9800);
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .image-overlay {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        opacity: 0;
        transition: opacity 0.3s;
      }

      &:hover .image-overlay {
        opacity: 1;
      }

      .cover-badge {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        background: var(--warning-color, #ff9800);
        color: white;
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.875rem;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 0.25rem;
      }
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      padding-top: 1rem;
    }

    :host ::ng-deep {
      .p-fileupload {
        width: 100%;
      }

      .p-button {
        min-width: 150px;
      }
    }
  `]
})
export class NewsFormComponent implements OnInit {
  @ViewChild('fileUpload') fileUpload!: FileUpload;

  private newsService = inject(NewsService);
  private messageService = inject(MessageService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  config = inject(ConfigService);

  isEditMode = false;
  newsId?: string;
  
  news: Partial<News> = {
    title: '',
    excerpt: '',
    content: '',
    images: [],
    coverImage: undefined
  };

  selectedFiles: File[] = [];
  uploading = false;
  uploadProgress = 0;
  saving = false;

  displayGallery = false;
  activeImageIndex = 0;

  responsiveOptions = [
    { breakpoint: '1024px', numVisible: 5 },
    { breakpoint: '768px', numVisible: 3 },
    { breakpoint: '560px', numVisible: 1 }
  ];

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.newsId = params['id'];
        this.loadNews(this.newsId);
      }
    });
  }

  loadNews(id: string) {
    this.newsService.getNewsById(id).subscribe({
      next: (data) => {
        this.news = data;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Помилка',
          detail: 'Не вдалося завантажити новину'
        });
      }
    });
  }

  onImagesSelect(event: any) {
    this.selectedFiles = event.currentFiles;
    
    // Валідація кількості файлів
    if (this.selectedFiles.length > 10) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Забагато файлів',
        detail: 'Можна завантажити максимум 10 зображень'
      });
      this.selectedFiles = this.selectedFiles.slice(0, 10);
    }
  }

  onImageRemove(event: any) {
    this.selectedFiles = this.selectedFiles.filter(f => f !== event.file);
  }

  onClearImages() {
    this.selectedFiles = [];
  }

  clearSelectedFiles() {
    this.fileUpload.clear();
    this.selectedFiles = [];
  }

  // Завантаження зображень на сервер
  uploadImages() {
    if (this.selectedFiles.length === 0) return;

    this.uploading = true;
    this.uploadProgress = 0;

    // Використання методу з прогресом
    this.newsService.uploadNewsImagesWithProgress(this.selectedFiles, this.newsId)
      .subscribe({
        next: (result) => {
          this.uploadProgress = result.progress;
          
          if (result.response) {
            // Додаємо нові URL до масиву зображень
            const newImages = result.response.images.map(img => img.url);
            this.news.images = [...(this.news.images || []), ...newImages];
            
            // Якщо це перше зображення - встановлюємо як головне
            if (!this.news.coverImage && newImages.length > 0) {
              this.news.coverImage = newImages[0];
            }

            this.uploading = false;
            this.clearSelectedFiles();
            
            this.messageService.add({
              severity: 'success',
              summary: 'Успішно',
              detail: `Завантажено ${result.response.uploadedCount} зображень`,
              life: 3000
            });
          }
        },
        error: () => {
          this.uploading = false;
          this.uploadProgress = 0;
          
          this.messageService.add({
            severity: 'error',
            summary: 'Помилка',
            detail: 'Не вдалося завантажити зображення'
          });
        }
      });
  }

  deleteImage(imageUrl: string, index: number) {
    if (!this.newsId) {
      // Якщо новина ще не збережена - просто видаляємо з масиву
      this.news.images = this.news.images?.filter(img => img !== imageUrl);
      return;
    }

    this.newsService.deleteNewsImage(this.newsId, imageUrl).subscribe({
      next: () => {
        this.news.images = this.news.images?.filter(img => img !== imageUrl);
        
        // Якщо видалили головне зображення - встановлюємо перше як головне
        if (this.news.coverImage === imageUrl && this.news.images && this.news.images.length > 0) {
          this.news.coverImage = this.news.images[0];
        }
        
        this.messageService.add({
          severity: 'info',
          summary: 'Видалено',
          detail: 'Зображення видалено',
          life: 2000
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Помилка',
          detail: 'Не вдалося видалити зображення'
        });
      }
    });
  }

  setCoverImage(imageUrl: string) {
    if (!this.newsId) {
      this.news.coverImage = imageUrl;
      return;
    }

    this.newsService.setCoverImage(this.newsId, imageUrl).subscribe({
      next: (updatedNews) => {
        this.news.coverImage = updatedNews.coverImage;
        
        this.messageService.add({
          severity: 'success',
          summary: 'Оновлено',
          detail: 'Головне зображення змінено',
          life: 2000
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Помилка',
          detail: 'Не вдалося змінити головне зображення'
        });
      }
    });
  }

  viewImage(index: number) {
    this.activeImageIndex = index;
    this.displayGallery = true;
  }

  getFilePreview(file: File): string {
    return URL.createObjectURL(file);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  onSubmit() {
    if (!this.news.title || !this.news.excerpt || !this.news.content) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Заповніть всі поля',
        detail: 'Всі обов\'язкові поля мають бути заповнені'
      });
      return;
    }

    this.saving = true;

    const operation = this.isEditMode && this.newsId
      ? this.newsService.updateNews(this.newsId, this.news)
      : this.newsService.createNews(this.news);

    operation.subscribe({
      next: (savedNews) => {
        this.saving = false;
        
        this.messageService.add({
          severity: 'success',
          summary: 'Збережено',
          detail: this.isEditMode ? 'Новину оновлено' : 'Новину створено',
          life: 3000
        });

        setTimeout(() => {
          this.router.navigate(['/news', savedNews.id]);
        }, 1000);
      },
      error: () => {
        this.saving = false;
        
        this.messageService.add({
          severity: 'error',
          summary: 'Помилка',
          detail: 'Не вдалося зберегти новину'
        });
      }
    });
  }

  cancel() {
    this.router.navigate(['/news']);
  }
}

// ========================================
// BACKEND ПРИКЛАД (Node.js + Express + Multer)
// ========================================

/*
// 📁 backend/routes/news.routes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Налаштування Multer для множинного завантаження
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/news';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'news-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB на файл
    files: 10 // Максимум 10 файлів
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Тільки зображення дозволені!'));
    }
  }
});

// POST /api/news/upload-images - Завантаження множини зображень
router.post('/upload-images', authenticateUser, upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Файли не знайдено' });
    }

    const images = req.files.map(file => ({
      url: `/uploads/news/${file.filename}`,
      filename: file.filename,
      size: file.size,
      mimeType: file.mimetype
    }));

    const totalSize = req.files.reduce((sum, file) => sum + file.size, 0);

    res.json({
      images,
      totalSize,
      uploadedCount: req.files.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Помилка завантаження' });
  }
});

// POST /api/news/upload-image - Завантаження одного зображення
router.post('/upload-image', authenticateUser, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Файл не знайдено' });
    }

    res.json({
      url: `/uploads/news/${req.file.filename}`,
      filename: req.file.filename,
      size: req.file.size,
      mimeType: req.file.mimetype
    });
  } catch (error) {
    res.status(500).json({ message: 'Помилка зав