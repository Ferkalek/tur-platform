import { ChangeDetectorRef, Component, DestroyRef, inject, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize, switchMap } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { News, NewsFormData, NewsFormType } from '../../../core/models';
import { MSG_CONFIG } from '../../../core/const';
import { NewsService } from '../../../core/services';
import { StaticUrlPipe } from '../../../shared/pipes';

@Component({
  selector: 'app-news-form',
  templateUrl: './news-form.component.html',
  styleUrls: ['./news-form.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    MessageModule,
    FileUploadModule,
    ToastModule,
    StaticUrlPipe,
  ],
  providers: [MessageService]
})
export class NewsFormComponent implements OnInit {
  @ViewChild('filesUpload') filesUpload!: FileUpload;

  private fb = inject(FormBuilder);
  private dialogRef = inject(DynamicDialogRef);
  private dialogConfig = inject(DynamicDialogConfig<NewsFormData>);
  private messageService = inject(MessageService);
  private newsService = inject(NewsService);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);

  form = this.fb.nonNullable.group<NewsFormType>({
    title: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    excerpt: new FormControl<string>('', [Validators.required, Validators.maxLength(250)]),
    content: new FormControl<string>('', [Validators.required]),
    images: new FormControl<string[]>([]),
  });

  newsId: string;
  selectedFiles: File[] = [];
  uploading = false;
  shouldUpdate = false;

  get titleControl(): AbstractControl<string | null> | null {
    return this.form.get('title');
  }

  get excerptControl(): AbstractControl<string | null> | null {
    return this.form.get('excerpt');
  }

  get contentControl(): AbstractControl<string | null> | null {
    return this.form.get('content');
  }

  get imagesControl(): AbstractControl<string[] | null> | null {
    return this.form.get('images');
  }

  ngOnInit(): void {
    this.newsId = this.dialogConfig.data?.id;

    if (this.newsId) {
      const { title, excerpt, content, images } = this.dialogConfig.data;

      this.form.patchValue({
        title,
        excerpt,
        content,
        images
      });
    }
  }

  save(): void {
    if (this.form.invalid) return;

    const msgConfig = {
      create: {
        next: () => this.messageService.add(MSG_CONFIG.createNewsSuccess),
        error: () => this.messageService.add(MSG_CONFIG.createNewsError),
      },
      update: {
        next: () => this.messageService.add(MSG_CONFIG.updateNewsSuccess),
        error: () => this.messageService.add(MSG_CONFIG.updateNewsError),
      }
    };

    this.uploading = true;

    if (this.selectedFiles.length > 0) {
      if (this.newsId) {
        this.newsService.addImages(this.newsId, this.selectedFiles)
          .pipe(
            switchMap((news: News) => {
              const updatedNews = {
                ...this.dialogConfig.data,
                ...this.form.value,
                images: news.images
              };

              delete updatedNews.userId;
              return this.newsService.updateNews(news.id, updatedNews as Partial<News>);
            }),
            takeUntilDestroyed(this.destroyRef),
            finalize(() => this.dialogRef.close(true)),
          )
          .subscribe(msgConfig.update);
      } else {
        this.newsService.createNews(this.form.value as NewsFormData)
          .pipe(
            switchMap((news: News) => {
              return this.newsService.addImages(news.id, this.selectedFiles);
            }),
            takeUntilDestroyed(this.destroyRef),
            finalize(() => this.dialogRef.close(true)),
          )
          .subscribe(msgConfig.create);
      }
    } else {
      if (this.newsId) {
        const updatedNews = {
          ...this.dialogConfig.data,
          ...this.form.value,
        };

        delete updatedNews.userId;
        this.newsService.updateNews(this.newsId, updatedNews as Partial<News>)
          .pipe(
            takeUntilDestroyed(this.destroyRef),
            finalize(() => this.dialogRef.close(true)),
          )
          .subscribe(msgConfig.update);
      } else {
        this.newsService.createNews(this.form.value as NewsFormData)
          .pipe(
            takeUntilDestroyed(this.destroyRef),
            finalize(() => this.dialogRef.close(true)),
          )
          .subscribe(msgConfig.create);
      }
    }
  }

  close(): void {
    this.dialogRef.close(this.shouldUpdate);
  }

  onSelectFiles(event: any): void {
    this.selectedFiles = event.currentFiles;
  }

  onUploadError(event: any): void {
    this.messageService.add(MSG_CONFIG.defaultError);
  }

  deleteImage(imageUrl: string): void {
    if (!this.newsId) {
      this.imagesControl?.setValue((this.imagesControl?.value || []).filter(img => img !== imageUrl));
      return;
    }

    this.newsService.deleteImage(this.newsId, imageUrl)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.uploading = false;
          this.clearSelectedFiles();
          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: () => {
          this.shouldUpdate = true;
          this.imagesControl?.setValue((this.imagesControl?.value || []).filter(img => img !== imageUrl));
          
          // // Якщо видалили головне зображення - встановлюємо перше як головне
          // if (this.news.coverImage === imageUrl && this.news.images && this.news.images.length > 0) {
          //   this.news.coverImage = this.news.images[0];
          // }
          
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
  //   if (!this.newsId) {
  //     this.news.coverImage = imageUrl;
  //     return;
  //   }

  //   this.newsService.setCoverImage(this.newsId, imageUrl).subscribe({
  //     next: (updatedNews) => {
  //       this.news.coverImage = updatedNews.coverImage;
        
  //       this.messageService.add({
  //         severity: 'success',
  //         summary: 'Оновлено',
  //         detail: 'Головне зображення змінено',
  //         life: 2000
  //       });
  //     },
  //     error: () => {
  //       this.messageService.add({
  //         severity: 'error',
  //         summary: 'Помилка',
  //         detail: 'Не вдалося змінити головне зображення'
  //       });
  //     }
  //   });
  }

  private clearSelectedFiles(): void {
    this.filesUpload.clear();
    this.selectedFiles = [];
  }
}
