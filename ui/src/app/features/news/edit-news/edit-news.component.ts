import { Component, DestroyRef, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { MessageModule } from 'primeng/message';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { News, NewsFormType } from '../../../core/models';
import { NewsService } from '../../../core/services';
import { StaticUrlPipe } from '../../../shared/pipes';
import { distinctUntilChanged, finalize, map, Observable, startWith, switchMap } from 'rxjs';
import { MSG_CONFIG } from '../../../core/const';
import { LoaderComponent } from '../../../shared/components';

@Component({
  selector: 'app-edit-news',
  templateUrl: './edit-news.component.html',
  styleUrls: ['./edit-news.component.scss'],
  standalone: true,
  imports: [
    LoaderComponent,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    MessageModule,
    FileUploadModule,
    ToastModule,
    StaticUrlPipe,
    AsyncPipe,
  ],
  providers: [MessageService],
  host: { class: 'block w-10 mx-auto p-5' },
})

export class EditNewsComponent implements OnInit {
  @ViewChild('filesUpload') filesUpload!: FileUpload;

  private newsService = inject(NewsService);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);

  form = this.fb.nonNullable.group<NewsFormType>({
    title: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    excerpt: new FormControl<string>('', [Validators.required, Validators.maxLength(250)]),
    content: new FormControl<string>('', [Validators.required]),
    images: new FormControl<string[]>([]),
  });

  newsId: string;
  defaultNews: News | null = null;
  selectedFiles: File[] = [];
  fileLimit = 5;
  loading = false;

  hasChanges$: Observable<boolean>;

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

  ngOnInit() {
    this.newsId = this.route.snapshot.paramMap.get('id') || '';
    this.loading = true;
    this.newsService.getNewsById(this.newsId)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading = false),
      )
      .subscribe(news => {
        if (!news) return;

        this.initForm(news);
      });
  }

  save(): void {
    if (this.form.invalid) return;

    console.log('.... form value', this.form.value);
    this.loading = true;
    // if has new images in selectedFiles, upload them first
    if (this.selectedFiles.length > 0) {
      this.newsService.addImages(this.newsId, this.selectedFiles)
        .pipe(
          switchMap((news: News) => {
            const newChanges = {
              ...this.form.value,
              images: news.images,
            };

            return this.newsService.updateNews(this.newsId, newChanges as Partial<News>);
          }),
          takeUntilDestroyed(this.destroyRef),
          finalize(() => this.loading = false)
        )
        .subscribe({
          next: (updatedNews: News) => {
            this.initForm(updatedNews);
            this.messageService.add(MSG_CONFIG.updateNewsSuccess);
          },
          error: () => {
            this.messageService.add(MSG_CONFIG.updateNewsError);
          }
        });
    } else {
      this.newsService.updateNews(this.newsId, this.form.value as Partial<News>)
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          finalize(() => this.loading = false)
        )
        .subscribe({
          next: (updatedNews: News) => {
            this.initForm(updatedNews);
            this.messageService.add(MSG_CONFIG.updateNewsSuccess);
          },
          error: () => {
            this.messageService.add(MSG_CONFIG.updateNewsError);
          }
        });
    }
  }

  cancel(): void {
    this.initForm(this.defaultNews as News);
    this.selectedFiles = [];
    this.filesUpload.clear();
  }

  onClearFiles(): void {
    this.selectedFiles = [];
  }

  onSelectFiles(event: any): void {
    if (event.currentFiles.length > this.fileLimit) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: `Maximum 5 images per news. Now: ${this.imagesControl?.value?.length}, trying to add: ${event.currentFiles.length}`,
      });
    } else {
      this.selectedFiles = event.currentFiles;
    }
  }

  onUploadError(event: any): void {
    console.error('Upload Error:', event);
  }

  deleteImage(imageUrl: string): void {
    const currentImages = this.imagesControl?.value || [];
    const updatedImages = currentImages.filter(url => url !== imageUrl);

    this.imagesControl?.setValue(updatedImages);
    this.fileLimit++;
  }

  private initForm(news: News): void {
    this.defaultNews = news;
    const { title, excerpt, content, images } = this.defaultNews;

    this.fileLimit = 5 - (images ? images.length : 0);
    this.form.patchValue({ title, excerpt, content, images });
    
    this.hasChanges$ = this.form.valueChanges.pipe(
      startWith(this.form.value),
      map(currentValue => {
        return JSON.stringify(currentValue) !== JSON.stringify({
          title: title || '',
          excerpt: excerpt || '',
          content: content || '',
          images: images || []
        }) || this.selectedFiles.length > 0;
      }),
      distinctUntilChanged(),
    );
  }
}
