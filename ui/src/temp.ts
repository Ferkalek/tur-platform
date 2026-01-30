// ========================================
// МОДЕЛЬ ДАНИХ
// ========================================

// 📁 src/app/core/models/news.model.ts (ОНОВЛЕНИЙ)
// export interface News {
//   id: string;
//   title: string;
//   excerpt: string;
//   content: string;
//   images: string[];  // ✅ Масив URL зображень
//   coverImage?: string;  // Головне зображення (опціонально)
//   date: Date;
//   author: string;
// }

// export interface ImageUploadResponse {
//   url: string;
//   filename: string;
//   size: number;
//   mimeType: string;
// }

// export interface MultipleImagesUploadResponse {
//   images: ImageUploadResponse[];
//   totalSize: number;
//   uploadedCount: number;
// }

// // ========================================
// // СЕРВІС ДЛЯ РОБОТИ З НОВИНАМИ
// // ========================================

// // 📁 src/app/core/services/news.service.ts (ОНОВЛЕНИЙ)
// import { Injectable, inject } from '@angular/core';
// import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
// import { Observable, map } from 'rxjs';
// import { News, ImageUploadResponse, MultipleImagesUploadResponse } from '../models/news.model';

// @Injectable({
//   providedIn: 'root'
// })
// export class NewsService {
//   private http = inject(HttpClient);

//   getNews(): Observable<News[]> {
//     return this.http.get<News[]>('news');
//   }

//   getNewsById(id: string): Observable<News> {
//     return this.http.get<News>(`news/${id}`);
//   }

//   createNews(news: Partial<News>): Observable<News> {
//     return this.http.post<News>('news', news);
//   }

//   updateNews(id: string, news: Partial<News>): Observable<News> {
//     return this.http.put<News>(`news/${id}`, news);
//   }

//   deleteNews(id: string): Observable<void> {
//     return this.http.delete<void>(`news/${id}`);
//   }

//   // ✅ МЕТОД 1: Завантаження одного зображення
//   uploadNewsImage(file: File, newsId?: string): Observable<ImageUploadResponse> {
//     const formData = new FormData();
//     formData.append('image', file);
    
//     if (newsId) {
//       formData.append('newsId', newsId);
//     }
    
//     return this.http.post<ImageUploadResponse>('news/upload-image', formData);
//   }

//   // ✅ МЕТОД 2: Завантаження множини зображень
//   uploadNewsImages(files: File[], newsId?: string): Observable<MultipleImagesUploadResponse> {
//     const formData = new FormData();
    
//     // Додаємо всі файли до FormData
//     files.forEach((file, index) => {
//       formData.append('images', file, file.name);
//       // або formData.append(`images[${index}]`, file, file.name);
//     });
    
//     if (newsId) {
//       formData.append('newsId', newsId);
//     }
    
//     return this.http.post<MultipleImagesUploadResponse>('news/upload-images', formData);
//   }

//   // ✅ МЕТОД 3: Завантаження з прогресом (для великих файлів)
//   uploadNewsImagesWithProgress(
//     files: File[], 
//     newsId?: string
//   ): Observable<{ progress: number; response?: MultipleImagesUploadResponse }> {
//     const formData = new FormData();
    
//     files.forEach((file) => {
//       formData.append('images', file, file.name);
//     });
    
//     if (newsId) {
//       formData.append('newsId', newsId);
//     }
    
//     return this.http.post<MultipleImagesUploadResponse>('news/upload-images', formData, {
//       reportProgress: true,
//       observe: 'events'
//     }).pipe(
//       map((event: HttpEvent<MultipleImagesUploadResponse>) => {
//         switch (event.type) {
//           case HttpEventType.UploadProgress:
//             const progress = event.total 
//               ? Math.round((100 * event.loaded) / event.total)
//               : 0;
//             return { progress };
          
//           case HttpEventType.Response:
//             return { progress: 100, response: event.body || undefined };
          
//           default:
//             return { progress: 0 };
//         }
//       })
//     );
//   }
// }

// // ========================================
// // КОМПОНЕНТ ДЛЯ СТВОРЕННЯ/РЕДАГУВАННЯ НОВИНИ
// // ========================================

// // 📁 src/app/features/news/news-form/news-form.component.ts
// import { Component, OnInit, inject, ViewChild } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { ActivatedRoute, Router } from '@angular/router';
// import { NewsService } from '../../../core/services/news.service';
// import { ConfigService } from '../../../core/services/config.service';
// import { News } from '../../../core/models/news.model';

// // PrimeNG
// import { ButtonModule } from 'primeng/button';
// import { InputTextModule } from 'primeng/inputtext';
// import { InputTextareaModule } from 'primeng/inputtextarea';
// import { FileUpload, FileUploadModule } from 'primeng/fileupload';
// import { ToastModule } from 'primeng/toast';
// import { MessageService } from 'primeng/api';
// import { CardModule } from 'primeng/card';

// @Component({
//   selector: 'app-news-form',
//   standalone: true,
//   imports: [
//     CommonModule,
//     FormsModule,
//     ButtonModule,
//     InputTextModule,
//     InputTextareaModule,
//     FileUploadModule,
//     ToastModule,
//     CardModule,
//   ],
//   providers: [MessageService],
//   template: `
//     <div class="news-form-container">
//       <p-toast />
      
//       <h2>{{ isEditMode ? 'Редагування новини' : 'Створення новини' }}</h2>

//       <form (ngSubmit)="onSubmit()" class="news-form">
//         <p-card>
//           <ng-template pTemplate="header">
//             <div class="card-header">
//               <h3>Основна інформація</h3>
//             </div>
//           </ng-template>

//           <div class="form-field">
//             <label for="title">Заголовок *</label>
//             <input
//               pInputText
//               type="text"
//               id="title"
//               [(ngModel)]="news.title"
//               name="title"
//               placeholder="Введіть заголовок новини"
//               required
//             >
//           </div>

//           <div class="form-field">
//             <label for="excerpt">Короткий опис *</label>
//             <textarea
//               pInputTextarea
//               id="excerpt"
//               [(ngModel)]="news.excerpt"
//               name="excerpt"
//               rows="3"
//               placeholder="Короткий опис новини для превью"
//               required
//             ></textarea>
//           </div>

//           <div class="form-field">
//             <label for="content">Контент *</label>
//             <textarea
//               pInputTextarea
//               id="content"
//               [(ngModel)]="news.content"
//               name="content"
//               rows="10"
//               placeholder="Повний текст новини"
//               required
//             ></textarea>
//           </div>
//         </p-card>

//         <p-card class="images-card">
//           <ng-template pTemplate="header">
//             <div class="card-header">
//               <h3>Зображення</h3>
//               <small>Ви можете завантажити до 10 зображень (макс. 5MB кожне)</small>
//             </div>
//           </ng-template>
//         </p-card>

//         <div class="form-actions">
//           <p-button
//             type="submit"
//             [label]="isEditMode ? 'Оновити' : 'Створити'"
//             icon="pi pi-check"
//             [loading]="saving"
//             [disabled]="saving || uploading"
//           />
          
//           <p-button
//             type="button"
//             label="Скасувати"
//             icon="pi pi-times"
//             severity="secondary"
//             [outlined]="true"
//             (onClick)="cancel()"
//             [disabled]="saving || uploading"
//           />
//         </div>
//       </form>
//     </div>
//   `,
//   styles: []
// })
// export class NewsFormComponent implements OnInit {
//   @ViewChild('fileUpload') fileUpload!: FileUpload;

//   private newsService = inject(NewsService);
//   private messageService = inject(MessageService);
//   private route = inject(ActivatedRoute);
//   private router = inject(Router);
//   config = inject(ConfigService);

//   isEditMode = false;
//   newsId?: string;
  
//   news: Partial<News> = {
//     title: '',
//     excerpt: '',
//     content: '',
//     images: [],
//     coverImage: undefined
//   };

//   selectedFiles: File[] = [];
//   uploading = false;
//   uploadProgress = 0;
//   saving = false;

//   ngOnInit() {
//     this.route.params.subscribe(params => {
//       if (params['id']) {
//         this.isEditMode = true;
//         this.newsId = params['id'];
//         this.loadNews(this.newsId);
//       }
//     });
//   }

//   loadNews(id: string) {
//     this.newsService.getNewsById(id).subscribe({
//       next: (data) => {
//         this.news = data;
//       },
//       error: () => {
//         this.messageService.add({
//           severity: 'error',
//           summary: 'Помилка',
//           detail: 'Не вдалося завантажити новину'
//         });
//       }
//     });
//   }


// }

// ========================================
// BACKEND ПРИКЛАД (Node.js + Express + Multer)
// ========================================

/*
// 📁 backend/routes/news.routes.js
// const express = require('express');
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');
// const router = express.Router();

// // Налаштування Multer для множинного завантаження
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadDir = 'uploads/news';
//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir, { recursive: true });
//     }
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, 'news-' + uniqueSuffix + path.extname(file.originalname));
//   }
// });

// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 5 * 1024 * 1024, // 5MB на файл
//     files: 10 // Максимум 10 файлів
//   },
//   fileFilter: (req, file, cb) => {
//     const allowedTypes = /jpeg|jpg|png|gif|webp/;
//     const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = allowedTypes.test(file.mimetype);
    
//     if (mimetype && extname) {
//       return cb(null, true);
//     } else {
//       cb(new Error('Тільки зображення дозволені!'));
//     }
//   }
// });

// // POST /api/news/upload-images - Завантаження множини зображень
// router.post('/upload-images', authenticateUser, upload.array('images', 10), async (req, res) => {
//   try {
//     if (!req.files || req.files.length === 0) {
//       return res.status(400).json({ message: 'Файли не знайдено' });
//     }

//     const images = req.files.map(file => ({
//       url: `/uploads/news/${file.filename}`,
//       filename: file.filename,
//       size: file.size,
//       mimeType: file.mimetype
//     }));

//     const totalSize = req.files.reduce((sum, file) => sum + file.size, 0);

//     res.json({
//       images,
//       totalSize,
//       uploadedCount: req.files.length
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Помилка завантаження' });
//   }
// });

// // POST /api/news/upload-image - Завантаження одного зображення
// router.post('/upload-image', authenticateUser, upload.single('image'), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: 'Файл не знайдено' });
//     }

//     res.json({
//       url: `/uploads/news/${req.file.filename}`,
//       filename: req.file.filename,
//       size: req.file.size,
//       mimeType: req.file.mimetype
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Помилка зав')
*/