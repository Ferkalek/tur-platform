import { ChangeDetectorRef, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { MessageService, ToastMessageOptions } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { finalize } from 'rxjs';

import { UsersNewsListComponent } from '../../news/users-news-list/users-news-list.component';
import { News, NewsFormData } from '../../../core/models';
import { NewsFormComponent } from '../../news/news-form/news-form.component';
import { AuthService, NewsService } from '../../../core/services';
import { MSG_CONFIG } from '../../../core/const';
import { LoaderComponent } from '../../../shared/components';

@Component({
  selector: 'app-my-news',
  templateUrl: './my-news.component.html',
  styleUrls: ['./my-news.component.scss'],
  standalone: true,
  imports: [
    ButtonModule,
    DialogModule,
    UsersNewsListComponent,
    LoaderComponent,
    ToastModule,
  ],
  providers: [
    DialogService,
    MessageService,
  ],
})
export class MyNewsComponent implements OnInit {
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
    modal: true,
    styleClass: 'non-footer'
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
        userId: this.authService.currentUser()?.id || ''
      }
    };
    const dialogRef = this.dialogService.open(NewsFormComponent, dialogData);
    
    dialogRef?.onClose
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        if (data) {
          this.loading = true;
          this.loadNews();
        }
      });
  }
  
  editNews(news: News): void {
    const dialogData: DynamicDialogConfig<NewsFormData> = {
      header: 'Edit News',
      ...this.defaultDialogConfig,
      data: { ...news },
    };
    const dialogRef = this.dialogService.open(NewsFormComponent, dialogData);

    dialogRef?.onClose
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        if (data) {
          this.loading = true;
          this.loadNews();
        }
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

  private errorHandler(error: any, msgConfig: ToastMessageOptions, time = 1000): void {
    if (error?.error.statusCode === 401 || error?.statusCode === 401) {
      this.messageService.add(MSG_CONFIG.unauthorize);

      setTimeout(() => this.authService.logout(), time);
    } else {
      this.messageService.add(msgConfig);
    }
  }
}
