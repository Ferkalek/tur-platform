// 📁 src/app/core/models/user.model.ts (ОНОВЛЕНИЙ)
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  bio: string;
  avatar?: string; // URL аватара
}

export interface AvatarUploadResponse {
  url: string;
  filename: string;
}

// 📁 src/app/core/services/profile.service.ts (ОНОВЛЕНИЙ)
import { Injectable } from '@angular/core';
import { Observable, of, delay, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UserProfile, AvatarUploadResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = '/api/profile'; // Замініть на ваш API URL
  
  private mockProfile: UserProfile = {
    id: '1',
    name: 'Іван Петренко',
    email: 'ivan.petrenko@example.com',
    phone: '+380 50 123 4567',
    bio: 'Frontend розробник з досвідом роботи в Angular та TypeScript.',
    avatar: 'https://i.pravatar.cc/150?img=12'
  };

  constructor(private http: HttpClient) {}

  getProfile(): Observable<UserProfile> {
    // Mock - замініть на реальний запит
    return of(this.mockProfile).pipe(delay(500));
    
    // Реальний запит:
    // return this.http.get<UserProfile>(`${this.apiUrl}`);
  }

  updateProfile(profile: UserProfile): Observable<UserProfile> {
    // Mock - замініть на реальний запит
    this.mockProfile = { ...profile };
    return of(this.mockProfile).pipe(delay(800));
    
    // Реальний запит:
    // return this.http.put<UserProfile>(`${this.apiUrl}`, profile);
  }

  uploadAvatar(file: File): Observable<AvatarUploadResponse> {
    const formData = new FormData();
    formData.append('avatar', file);

    // Mock відповідь - замініть на реальний запит
    return of({
      url: URL.createObjectURL(file),
      filename: file.name
    }).pipe(delay(1000));
    
    // Реальний запит:
    // return this.http.post<AvatarUploadResponse>(
    //   `${this.apiUrl}/avatar`,
    //   formData
    // );
  }

  deleteAvatar(): Observable<void> {
    // Mock - замініть на реальний запит
    this.mockProfile.avatar = undefined;
    return of(void 0).pipe(delay(500));
    
    // Реальний запит:
    // return this.http.delete<void>(`${this.apiUrl}/avatar`);
  }
}

// 📁 src/app/features/profile/profile.component.ts (ОНОВЛЕНИЙ)
import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../core/services/profile.service';
import { UserProfile } from '../../core/models/user.model';

// PrimeNG Imports
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    FileUploadModule,
    ToastModule,
    AvatarModule,
    CardModule,
    DividerModule,
    ProgressSpinnerModule
  ],
  providers: [MessageService],
  template: `
    <div class="profile-container">
      <p-toast />
      
      <h2 class="profile-title">
        <i class="pi pi-user"></i>
        Особистий кабінет
      </h2>
      
      @if (loading) {
        <div class="loading-container">
          <p-progressSpinner />
          <p>Завантаження профілю...</p>
        </div>
      } @else {
        <div class="profile-layout">
          <!-- Ліва колонка - Аватар -->
          <p-card class="avatar-card">
            <ng-template pTemplate="header">
              <div class="avatar-header">
                <h3>Фото профілю</h3>
              </div>
            </ng-template>
            
            <div class="avatar-section">
              <div class="avatar-preview">
                @if (profile.avatar) {
                  <img 
                    [src]="profile.avatar" 
                    [alt]="profile.name"
                    class="avatar-image"
                  >
                } @else {
                  <p-avatar 
                    [label]="getInitials()" 
                    size="xlarge"
                    [style]="{'width': '150px', 'height': '150px', 'font-size': '3rem'}"
                    styleClass="custom-avatar"
                  />
                }
              </div>

              <div class="avatar-actions">
                <p-fileUpload
                  #fileUpload
                  mode="basic"
                  name="avatar"
                  accept="image/*"
                  [maxFileSize]="5000000"
                  [auto]="true"
                  chooseLabel="Вибрати фото"
                  [chooseIcon]="uploadingAvatar ? 'pi pi-spin pi-spinner' : 'pi pi-upload'"
                  [disabled]="uploadingAvatar"
                  (onSelect)="onAvatarSelect($event)"
                  (onError)="onUploadError($event)"
                  [customUpload]="true"
                  (uploadHandler)="onAvatarUpload($event)"
                />

                @if (profile.avatar) {
                  <p-button
                    label="Видалити"
                    icon="pi pi-trash"
                    severity="danger"
                    [outlined]="true"
                    [disabled]="deletingAvatar"
                    (onClick)="deleteAvatar()"
                  />
                }
              </div>

              <div class="avatar-info">
                <small>
                  <i class="pi pi-info-circle"></i>
                  Максимальний розмір: 5MB
                  <br>
                  Формати: JPG, PNG, GIF
                </small>
              </div>
            </div>
          </p-card>

          <!-- Права колонка - Форма -->
          <p-card class="profile-form-card">
            <ng-template pTemplate="header">
              <div class="form-header">
                <h3>Особиста інформація</h3>
              </div>
            </ng-template>

            <form class="profile-form" (ngSubmit)="saveProfile()">
              <div class="form-field">
                <label for="name">Ім'я *</label>
                <input 
                  pInputText
                  type="text" 
                  id="name" 
                  [(ngModel)]="profile.name" 
                  name="name"
                  placeholder="Введіть ваше ім'я"
                  required
                >
              </div>
              
              <div class="form-field">
                <label for="email">Email *</label>
                <input 
                  pInputText
                  type="email" 
                  id="email" 
                  [(ngModel)]="profile.email" 
                  name="email"
                  placeholder="example@mail.com"
                  required
                >
              </div>
              
              <div class="form-field">
                <label for="phone">Телефон</label>
                <input 
                  pInputText
                  type="tel" 
                  id="phone" 
                  [(ngModel)]="profile.phone" 
                  name="phone"
                  placeholder="+380 50 123 4567"
                >
              </div>
              
              <div class="form-field">
                <label for="bio">Про себе</label>
                <textarea 
                  pInputTextarea
                  id="bio" 
                  [(ngModel)]="profile.bio" 
                  name="bio"
                  rows="5"
                  placeholder="Розкажіть трохи про себе..."
                ></textarea>
              </div>

              <p-divider />

              <div class="form-actions">
                <p-button 
                  type="submit"
                  label="Зберегти зміни"
                  icon="pi pi-check"
                  [loading]="saving"
                  [disabled]="saving"
                />
                
                <p-button 
                  type="button"
                  label="Скасувати"
                  icon="pi pi-times"
                  severity="secondary"
                  [outlined]="true"
                  (onClick)="cancelEdit()"
                  [disabled]="saving"
                />
              </div>
            </form>
          </p-card>
        </div>
      }
    </div>
  `,
  styles: [`
    .profile-container {
      max-width: 1200px;
      margin: 0 auto;
      animation: fadeIn 0.5s ease-out;
    }

    .profile-title {
      font-size: 2rem;
      margin-bottom: 2rem;
      color: var(--text-primary, #333);
      display: flex;
      align-items: center;
      gap: 0.75rem;

      i {
        color: var(--primary-color, #1976d2);
      }
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem;
      gap: 1rem;

      p {
        color: var(--text-secondary, #666);
        font-size: 1.1rem;
      }
    }

    .profile-layout {
      display: grid;
      grid-template-columns: 350px 1fr;
      gap: 2rem;

      @media (max-width: 968px) {
        grid-template-columns: 1fr;
      }
    }

    .avatar-card {
      height: fit-content;
    }

    .avatar-header,
    .form-header {
      padding: 1.5rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

      h3 {
        margin: 0;
        color: white;
        font-size: 1.25rem;
        font-weight: 600;
      }
    }

    .avatar-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
      padding: 1.5rem;
    }

    .avatar-preview {
      position: relative;
      width: 150px;
      height: 150px;
      border-radius: 50%;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .avatar-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    :host ::ng-deep .custom-avatar {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      font-weight: 700;
    }

    .avatar-actions {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      width: 100%;
    }

    .avatar-info {
      text-align: center;
      color: var(--text-secondary, #666);
      padding: 1rem;
      background: var(--background-light, #f5f5f5);
      border-radius: 8px;
      width: 100%;

      small {
        display: block;
        line-height: 1.6;

        i {
          color: var(--info-color, #2196f3);
          margin-right: 0.25rem;
        }
      }
    }

    .profile-form-card {
      height: fit-content;
    }

    .profile-form {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-field {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      label {
        font-weight: 600;
        color: var(--text-primary, #333);
        font-size: 0.95rem;
      }
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;

      @media (max-width: 768px) {
        flex-direction: column;
      }
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* PrimeNG FileUpload override для кращого вигляду */
    :host ::ng-deep {
      .p-fileupload-choose {
        width: 100%;
      }

      .p-button {
        width: 100%;
      }
    }
  `]
})
export class ProfileComponent implements OnInit {
  @ViewChild('fileUpload') fileUpload!: FileUpload;

  private profileService = inject(ProfileService);
  private messageService = inject(MessageService);
  
  profile: UserProfile = {
    id: '',
    name: '',
    email: '',
    phone: '',
    bio: '',
    avatar: undefined
  };
  
  originalProfile: UserProfile = { ...this.profile };
  loading = true;
  saving = false;
  uploadingAvatar = false;
  deletingAvatar = false;

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.loading = true;
    this.profileService.getProfile().subscribe({
      next: (data) => {
        this.profile = data;
        this.originalProfile = { ...data };
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Помилка',
          detail: 'Не вдалося завантажити профіль'
        });
      }
    });
  }

  onAvatarSelect(event: any) {
    const file = event.files[0];
    
    // Валідація типу файлу
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Невірний формат',
        detail: 'Будь ласка, виберіть зображення (JPG, PNG, GIF)'
      });
      this.fileUpload.clear();
      return;
    }

    // Валідація розміру (5MB)
    if (file.size > 5000000) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Файл завеликий',
        detail: 'Максимальний розмір файлу: 5MB'
      });
      this.fileUpload.clear();
      return;
    }
  }

  onAvatarUpload(event: any) {
    const file = event.files[0];
    this.uploadingAvatar = true;

    this.profileService.uploadAvatar(file).subscribe({
      next: (response) => {
        this.profile.avatar = response.url;
        this.uploadingAvatar = false;
        this.fileUpload.clear();
        
        this.messageService.add({
          severity: 'success',
          summary: 'Успішно',
          detail: 'Аватар оновлено',
          life: 3000
        });
      },
      error: (error) => {
        this.uploadingAvatar = false;
        this.fileUpload.clear();
        
        this.messageService.add({
          severity: 'error',
          summary: 'Помилка',
          detail: 'Не вдалося завантажити аватар'
        });
      }
    });
  }

  onUploadError(event: any) {
    this.messageService.add({
      severity: 'error',
      summary: 'Помилка завантаження',
      detail: 'Щось пішло не так'
    });
  }

  deleteAvatar() {
    this.deletingAvatar = true;

    this.profileService.deleteAvatar().subscribe({
      next: () => {
        this.profile.avatar = undefined;
        this.deletingAvatar = false;
        
        this.messageService.add({
          severity: 'info',
          summary: 'Видалено',
          detail: 'Аватар видалено',
          life: 3000
        });
      },
      error: () => {
        this.deletingAvatar = false;
        
        this.messageService.add({
          severity: 'error',
          summary: 'Помилка',
          detail: 'Не вдалося видалити аватар'
        });
      }
    });
  }

  saveProfile() {
    this.saving = true;
    
    this.profileService.updateProfile(this.profile).subscribe({
      next: (updatedProfile) => {
        this.profile = updatedProfile;
        this.originalProfile = { ...updatedProfile };
        this.saving = false;
        
        this.messageService.add({
          severity: 'success',
          summary: 'Збережено',
          detail: 'Зміни успішно збережено',
          life: 3000
        });
      },
      error: () => {
        this.saving = false;
        
        this.messageService.add({
          severity: 'error',
          summary: 'Помилка',
          detail: 'Не вдалося зберегти зміни'
        });
      }
    });
  }

  cancelEdit() {
    this.profile = { ...this.originalProfile };
    
    this.messageService.add({
      severity: 'info',
      summary: 'Скасовано',
      detail: 'Зміни скасовано',
      life: 2000
    });
  }

  getInitials(): string {
    if (!this.profile.name) return '?';
    
    const names = this.profile.name.trim().split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  }
}

// ========================================
// BACKEND API ПРИКЛАД (Node.js + Express + Multer)
// ========================================

/*
// 📁 backend/routes/profile.routes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Налаштування Multer для завантаження файлів
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/avatars';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
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

// GET /api/profile - Отримати профіль
router.get('/', authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

// PUT /api/profile - Оновити профіль
router.put('/', authenticateUser, async (req, res) => {
  try {
    const { name, email, phone, bio } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { name, email, phone, bio },
      { new: true }
    );
    
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Помилка оновлення' });
  }
});

// POST /api/profile/avatar - Завантажити аватар
router.post('/avatar', authenticateUser, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Файл не знайдено' });
    }

    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    
    // Видалити старий аватар, якщо існує
    const user = await User.findById(req.userId);
    if (user.avatar) {
      const oldAvatarPath = path.join(__dirname, '..', user.avatar);
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }
    }
    
    // Оновити аватар в БД
    user.avatar = avatarUrl;
    await user.save();
    
    res.json({
      url: avatarUrl,
      filename: req.file.filename
    });
  } catch (error) {
    res.status(500).json({ message: 'Помилка завантаження' });
  }
});

// DELETE /api/profile/avatar - Видалити аватар
router.delete('/avatar', authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (user.avatar) {
      const avatarPath = path.join(__dirname, '..', user.avatar);
      if (fs.existsSync(avatarPath)) {
        fs.unlinkSync(avatarPath);
      }
      
      user.avatar = null;
      await user.save();
    }
    
    res.json({ message: 'Аватар видалено' });
  } catch (error) {
    res.status(500).json({ message: 'Помилка видалення' });
  }
});

module.exports = router;
*/