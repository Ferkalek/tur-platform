// 📁 src/app/app.config.ts
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
  ],
};

// 📁 src/app/app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/news',
    pathMatch: 'full',
  },
  {
    path: 'news',
    loadComponent: () => import('./features/news/news.component').then((m) => m.NewsComponent),
    title: 'Новини',
  },
  {
    path: 'news/:id',
    loadComponent: () =>
      import('./features/news/news-detail/news-detail.component').then(
        (m) => m.NewsDetailComponent
      ),
    title: 'Деталі новини',
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./features/profile/profile.component').then((m) => m.ProfileComponent),
    title: 'Особистий кабінет',
  },
  {
    path: '**',
    loadComponent: () =>
      import('./shared/components/not-found/not-found.component').then((m) => m.NotFoundComponent),
    title: 'Сторінку не знайдено',
  },
];

// 📁 src/app/app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-container">
      <header class="header">
        <nav class="nav">
          <h1 class="logo">MyApp</h1>
          <ul class="nav-list">
            <li>
              <a routerLink="/news" routerLinkActive="active" class="nav-link"> 📰 Новини </a>
            </li>
            <li>
              <a routerLink="/profile" routerLinkActive="active" class="nav-link">
                👤 Особистий кабінет
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <main class="main-content">
        <router-outlet />
      </main>

      <footer class="footer">
        <p>&copy; 2025 MyApp. Всі права захищені.</p>
      </footer>
    </div>
  `,
  styles: [
    `
      .app-container {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
      }

      .header {
        background: #1976d2;
        color: white;
        padding: 1rem 2rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .nav {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .logo {
        margin: 0;
        font-size: 1.5rem;
      }

      .nav-list {
        display: flex;
        gap: 2rem;
        list-style: none;
        margin: 0;
        padding: 0;
      }

      .nav-link {
        color: white;
        text-decoration: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        transition: background-color 0.3s;
      }

      .nav-link:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }

      .nav-link.active {
        background-color: rgba(255, 255, 255, 0.2);
        font-weight: 600;
      }

      .main-content {
        flex: 1;
        max-width: 1200px;
        width: 100%;
        margin: 0 auto;
        padding: 2rem;
      }

      .footer {
        background: #f5f5f5;
        padding: 1rem;
        text-align: center;
        color: #666;
      }
    `,
  ],
})
export class AppComponent {}

// 📁 src/app/features/news/news.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NewsService } from '../../core/services/news.service';
import { News } from '../../core/models/news.model';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="news-container">
      <h2>📰 Останні новини</h2>

      @if (loading) {
      <div class="loading">Завантаження...</div>
      } @else if (error) {
      <div class="error">{{ error }}</div>
      } @else {
      <div class="news-grid">
        @for (item of newsList; track item.id) {
        <article class="news-card">
          <img [src]="item.image" [alt]="item.title" class="news-image" />
          <div class="news-content">
            <h3>{{ item.title }}</h3>
            <p class="news-excerpt">{{ item.excerpt }}</p>
            <div class="news-meta">
              <span class="date">{{ item.date | date : 'dd.MM.yyyy' }}</span>
              <a [routerLink]="['/news', item.id]" class="read-more"> Читати далі → </a>
            </div>
          </div>
        </article>
        }
      </div>
      }
    </div>
  `,
  styles: [
    `
      .news-container {
        animation: fadeIn 0.5s;
      }

      h2 {
        font-size: 2rem;
        margin-bottom: 2rem;
        color: #333;
      }

      .loading,
      .error {
        text-align: center;
        padding: 2rem;
        font-size: 1.1rem;
      }

      .error {
        color: #d32f2f;
      }

      .news-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 2rem;
      }

      .news-card {
        background: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s, box-shadow 0.3s;
      }

      .news-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
      }

      .news-image {
        width: 100%;
        height: 200px;
        object-fit: cover;
      }

      .news-content {
        padding: 1.5rem;
      }

      .news-content h3 {
        margin: 0 0 1rem 0;
        color: #333;
        font-size: 1.25rem;
      }

      .news-excerpt {
        color: #666;
        line-height: 1.6;
        margin-bottom: 1rem;
      }

      .news-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 1rem;
        border-top: 1px solid #eee;
      }

      .date {
        color: #999;
        font-size: 0.9rem;
      }

      .read-more {
        color: #1976d2;
        text-decoration: none;
        font-weight: 600;
      }

      .read-more:hover {
        text-decoration: underline;
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
    `,
  ],
})
export class NewsComponent implements OnInit {
  private newsService = inject(NewsService);

  newsList: News[] = [];
  loading = true;
  error = '';

  ngOnInit() {
    this.loadNews();
  }

  loadNews() {
    this.newsService.getNews().subscribe({
      next: (data) => {
        this.newsList = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Помилка завантаження новин';
        this.loading = false;
      },
    });
  }
}

// 📁 src/app/features/profile/profile.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../core/services/profile.service';
import { UserProfile } from '../../core/models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="profile-container">
      <h2>👤 Особистий кабінет</h2>

      @if (loading) {
      <div class="loading">Завантаження...</div>
      } @else {
      <div class="profile-card">
        <div class="profile-header">
          <div class="avatar">
            {{ profile.name.charAt(0).toUpperCase() }}
          </div>
          <div class="profile-info">
            <h3>{{ profile.name }}</h3>
            <p class="email">{{ profile.email }}</p>
          </div>
        </div>

        <form class="profile-form" (ngSubmit)="saveProfile()">
          <div class="form-group">
            <label for="name">Ім'я</label>
            <input
              type="text"
              id="name"
              [(ngModel)]="profile.name"
              name="name"
              class="form-control"
            />
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              [(ngModel)]="profile.email"
              name="email"
              class="form-control"
            />
          </div>

          <div class="form-group">
            <label for="phone">Телефон</label>
            <input
              type="tel"
              id="phone"
              [(ngModel)]="profile.phone"
              name="phone"
              class="form-control"
            />
          </div>

          <div class="form-group">
            <label for="bio">Про себе</label>
            <textarea
              id="bio"
              [(ngModel)]="profile.bio"
              name="bio"
              rows="4"
              class="form-control"
            ></textarea>
          </div>

          <button type="submit" class="btn-primary" [disabled]="saving">
            {{ saving ? 'Збереження...' : 'Зберегти зміни' }}
          </button>

          @if (saveMessage) {
          <div class="save-message">{{ saveMessage }}</div>
          }
        </form>
      </div>
      }
    </div>
  `,
  styles: [
    `
      .profile-container {
        animation: fadeIn 0.5s;
        max-width: 800px;
      }

      h2 {
        font-size: 2rem;
        margin-bottom: 2rem;
        color: #333;
      }

      .profile-card {
        background: white;
        border-radius: 8px;
        padding: 2rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .profile-header {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        margin-bottom: 2rem;
        padding-bottom: 2rem;
        border-bottom: 1px solid #eee;
      }

      .avatar {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
        font-weight: bold;
      }

      .profile-info h3 {
        margin: 0 0 0.5rem 0;
        color: #333;
        font-size: 1.5rem;
      }

      .email {
        color: #666;
        margin: 0;
      }

      .profile-form {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      label {
        font-weight: 600;
        color: #333;
      }

      .form-control {
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;
        transition: border-color 0.3s;
      }

      .form-control:focus {
        outline: none;
        border-color: #1976d2;
      }

      textarea.form-control {
        resize: vertical;
        font-family: inherit;
      }

      .btn-primary {
        background: #1976d2;
        color: white;
        border: none;
        padding: 0.75rem 2rem;
        border-radius: 4px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.3s;
      }

      .btn-primary:hover:not(:disabled) {
        background: #1565c0;
      }

      .btn-primary:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .save-message {
        padding: 1rem;
        background: #4caf50;
        color: white;
        border-radius: 4px;
        text-align: center;
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
    `,
  ],
})
export class ProfileComponent implements OnInit {
  private profileService = inject(ProfileService);

  profile: UserProfile = {
    id: '',
    name: '',
    email: '',
    phone: '',
    bio: '',
  };
  loading = true;
  saving = false;
  saveMessage = '';

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.profileService.getProfile().subscribe({
      next: (data) => {
        this.profile = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  saveProfile() {
    this.saving = true;
    this.saveMessage = '';

    this.profileService.updateProfile(this.profile).subscribe({
      next: () => {
        this.saving = false;
        this.saveMessage = '✓ Зміни успішно збережено!';
        setTimeout(() => (this.saveMessage = ''), 3000);
      },
      error: () => {
        this.saving = false;
        this.saveMessage = '✗ Помилка збереження';
      },
    });
  }
}

// 📁 src/app/core/models/news.model.ts
export interface News {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: Date;
  author: string;
}

// 📁 src/app/core/models/user.model.ts
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  bio: string;
}

// 📁 src/app/core/services/news.service.ts
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

// 📁 src/app/core/services/profile.service.ts
import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { UserProfile } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private mockProfile: UserProfile = {
    id: '1',
    name: 'Іван Петренко',
    email: 'ivan.petrenko@example.com',
    phone: '+380 50 123 4567',
    bio: 'Frontend розробник з досвідом роботи в Angular та TypeScript.',
  };

  getProfile(): Observable<UserProfile> {
    return of(this.mockProfile).pipe(delay(500));
  }

  updateProfile(profile: UserProfile): Observable<UserProfile> {
    this.mockProfile = { ...profile };
    return of(this.mockProfile).pipe(delay(800));
  }
}

// 📁 src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
