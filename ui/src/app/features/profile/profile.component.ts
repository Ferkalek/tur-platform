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
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { NewsFormComponent } from '../news/news-form/news-form.component';
import { News, NewsFormData } from '../../core/models';
import { UsersNewsListComponent } from '../news/users-news-list/users-news-list.component';
import { NewsService } from '../../core/services';

@Component({
  selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [
    ProgressSpinnerModule,
    ToastModule,
    ButtonModule,
    RippleModule,
    DialogModule,
    UsersNewsListComponent,
],
  providers: [DialogService, MessageService],
})
export class ProfileComponent implements OnInit {
  private dialogService = inject(DialogService);
  private destroyRef = inject(DestroyRef);
  private newsService = inject(NewsService);
  private cdr = inject(ChangeDetectorRef);
  private messageService = inject(MessageService);

  loading = true;
  newsList: News[] = [];
  error = '';

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
    this.newsService.getNews()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.loading = false;
          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: (data) => {
          this.newsList = data;
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Something went wrong!',
          });
        },
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
            author: 'Default Author'
          };
          delete newsItem.userId;
          
          return this.newsService.createNews(newsItem);
        }),
      )
      .subscribe((data) => {
        if (data) {
          this.loadNews();
        }
      });
  }

  editNews(news: News): void {
    const dialogData: DynamicDialogConfig<NewsFormData> = {
      header: 'Edit News',
      ...this.defaultDialogConfig,
      data: {
        ...news,
        userId: 'current-user-id',
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

          const updatedNews = { ...result };
          delete updatedNews.userId;
          return this.newsService.updateNews(news.id, updatedNews as Partial<News>);
        }
      ))
      .subscribe({
        next: (data) => {
          if (!data) return;

          this.messageService.add({
            severity: 'success',
            summary: 'Create News',
            detail: 'News item has been created successfully.',
          });

          this.loadNews();
        },
        error: () => {
          this.loading = false;

          this.messageService.add({
            severity: 'error',
            summary: 'Update News',
            detail: 'Error updating news item.',
          });
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
          this.messageService.add({
            severity: 'success',
            summary: 'Deleted News',
            detail: 'News item has been deleted successfully.',
          });

          this.loadNews();
        },
        error: () => {
          this.loading = false;

          this.messageService.add({
            severity: 'error',
            summary: 'Deleted News',
            detail: 'Error deleting news item.',
          });
        },
      });
  }

  private getRandomImage(): string {
    return `https://picsum.photos/800/400?random=${Math.floor(Math.random() * 100)}`;
  }
}
