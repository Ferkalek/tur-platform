import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { NewsFormData, NewsFormType } from '../../../core/models';
import { MSG_CONFIG } from '../../../core/const';
import { NewsService } from '../../../core/services';

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

  form = this.fb.nonNullable.group<NewsFormType>({
    title: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    excerpt: new FormControl<string>('', [Validators.required, Validators.maxLength(250)]),
    content: new FormControl<string>('', [Validators.required]),
  });

  get titleControl(): AbstractControl<string | null> | null {
    return this.form.get('title');
  }

  get excerptControl(): AbstractControl<string | null> | null {
    return this.form.get('excerpt');
  }

  get contentControl(): AbstractControl<string | null> | null {
    return this.form.get('content');
  }

  ngOnInit(): void {
    if (this.dialogConfig.data?.id) {
      const { title, excerpt, content } = this.dialogConfig.data;

      this.form.patchValue({
        title,
        excerpt,
        content
      });
    }
  }

  save(): void {
    if (this.form.invalid) return;

    this.dialogRef.close({
      ...this.dialogConfig.data,
      ...this.form.value
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  onSelectFiles(event: any): void {
    const files = event.files;
    console.log('....... onSelectFiles > event.files', files)
  }

  onUploadFiles(event: any): void {
    const files = event.files;
    console.log('....... onUploadFiles > files', files)
    // this.uploadingAvatar = true;

    const newsId = this.dialogConfig.data?.id;
    console.log('....... onUploadFiles > newsId', newsId)
    this.newsService.addImages(newsId, files).subscribe({
      next: (res) => {
        console.log('>>>> res', res);
        // this.profile = userProfile;
        // this.cdr.markForCheck();
        // this.uploadingAvatar = false;
        // this.filesUpload.clear();
        
        // this.messageService.add(MSG_CONFIG.updateAvatarSuccess);
      },
      error: (err) => {
        console.log('>>>> err', err);
        // this.uploadingAvatar = false;
        // this.filesUpload.clear();
        
        // this.messageService.add(MSG_CONFIG.updateAvatarError);
      }
    });
  }

  onUploadError(event: any): void {
    console.log('....... onUploadError', event)
    this.messageService.add(MSG_CONFIG.defaultError);
  }

  onUpload(event: any) {
    console.log('???????????? onUpload', event);
  }
}
