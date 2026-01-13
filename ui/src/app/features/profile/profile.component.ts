import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { finalize, mergeMap, of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { DialogModule } from 'primeng/dialog';
import { MessageService, ToastMessageOptions } from 'primeng/api';
import { DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { NewsFormComponent } from '../news/news-form/news-form.component';
import { News, NewsFormData } from '../../core/models';
import { UsersNewsListComponent } from '../news/users-news-list/users-news-list.component';
import { AuthService, NewsService } from '../../core/services';
import { MSG_CONFIG } from '../../core/const';
import { ProfileFormComponent } from './profile-form/profile-form.component';
import { LoaderComponent } from '../../shared/components';

@Component({
  selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [
    ToastModule,
    ButtonModule,
    RippleModule,
    DialogModule,
    UsersNewsListComponent,
    ProfileFormComponent,
    LoaderComponent,
],
  providers: [DialogService, MessageService],
})
export class ProfileComponent implements OnInit {
  private dialogService = inject(DialogService);
  private destroyRef = inject(DestroyRef);
  private newsService = inject(NewsService);
  private cdr = inject(ChangeDetectorRef);
  private messageService = inject(MessageService);
  private authService = inject(AuthService);

  loading = true;
  newsList: News[] = [];

  defaultDialogConfig: DynamicDialogConfig = {
    width: '700px',
    closable: true,
    closeOnEscape: true,
    focusOnShow: false,
    draggable: true,
    dismissableMask: true,
    keepInViewport: true,
    resizable: true,
  };

  ngOnInit(): void {
    this.loadNews();
  }

  loadNews() {
    this.newsService.getUserNews(this.authService.currentUser()?.id || '')
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.loading = false;
          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: (data) => this.newsList = data,
        error: (error) => this.errorHandler(error, MSG_CONFIG.defaultError),
      });
  }

  addNews(): void {
    const dialogData: DynamicDialogConfig<NewsFormData> = {
      header: 'Add News',
      ...this.defaultDialogConfig,
      data: {
        userId: 'current-user-id'
      }
    };
    const dialogRef = this.dialogService.open(NewsFormComponent, dialogData);
    
    dialogRef?.onClose
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        mergeMap((result) => {
          if (!result) {
            return of(null);
          }

          this.loading = true;

          const newsItem = {
            ...result,
            image: this.getRandomImage(),
          };
          delete newsItem.userId;
          
          return this.newsService.createNews(newsItem);
        }),
      )
      .subscribe({
        next: (data) => {
          if (!data) return;

          this.messageService.add(MSG_CONFIG.createNewsSuccess);
          this.loadNews();
        },
        error: (error) => {
          this.loading = false;

          this.errorHandler(error, MSG_CONFIG.createNewsError);
        }
      });
  }

  editNews(news: News): void {
    const dialogData: DynamicDialogConfig<NewsFormData> = {
      header: 'Edit News',
      ...this.defaultDialogConfig,
      data: { ...news }
    };
    const dialogRef = this.dialogService.open(NewsFormComponent, dialogData);

    dialogRef?.onClose
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        mergeMap((result) => {
          if (!result) {
            return of(null);
          }

          this.loading = true;

          const updatedNews = { ...result };
          delete updatedNews.userId;
          return this.newsService.updateNews(news.id, updatedNews as Partial<News>);
        }
      ))
      .subscribe({
        next: (data) => {
          if (!data) return;

          this.messageService.add(MSG_CONFIG.updateNewsSuccess);

          this.loadNews();
        },
        error: (error) => {
          this.loading = false;

          this.errorHandler(error, MSG_CONFIG.updateNewsError);
        },
      });
  }

  onDeleteNews(newsId: string): void {
    this.loading = true;

    this.newsService.deleteNews(newsId)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          this.messageService.add(MSG_CONFIG.deleteNewsSuccess);

          this.loadNews();
        },
        error: (error) => {
          this.loading = false;

          this.errorHandler(error, MSG_CONFIG.deleteNewsError);
        },
      });
  }

  private getRandomImage(): string {
    return `https://picsum.photos/800/400?random=${Math.floor(Math.random() * 100)}`;
  }

  private errorHandler(error: any, msgConfig: ToastMessageOptions, time = 1000): void {
    if (error?.error.statusCode === 401 || error?.statusCode === 401) {
      this.messageService.add(MSG_CONFIG.unauthorize);

      setTimeout(() => this.authService.logout(), time);
    } else {
      this.messageService.add(msgConfig);
    }
  }
}
