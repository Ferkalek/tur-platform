import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { NewsFormData, NewsFormType } from '../../../core/models';

@Component({
  selector: 'app-news-form',
  templateUrl: './news-form.component.html',
  styleUrls: ['./news-form.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
  ],
})
export class NewsFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(DynamicDialogRef);
  private dialogConfig = inject(DynamicDialogConfig<NewsFormData>);

  form = this.fb.group<NewsFormType>({
    title: new FormControl<string>('', [Validators.required, Validators.maxLength(100)]),
    excerpt: new FormControl<string>('', [Validators.required, Validators.maxLength(250)]),
    content: new FormControl<string>('', [Validators.required]),
  });

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
}
