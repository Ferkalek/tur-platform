import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonDirective, ButtonModule } from "primeng/button";
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

interface NewsFormType {
  title: FormControl<string | null>;
  excerpt: FormControl<string | null>;
  content: FormControl<string | null>;
}

@Component({
  selector: 'app-news-form',
  templateUrl: './news-form.component.html',
  styleUrls: ['./news-form.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    ButtonDirective,
    ButtonModule
  ],
})
export class NewsFormComponent implements OnInit {
  
  private fb = inject(FormBuilder);
  private dialogRef = inject(DynamicDialogRef);
  private dialogConfig = inject(DynamicDialogConfig);

  isSaving = false
  form = this.fb.group<NewsFormType>({
    title: new FormControl<string>('', [Validators.required, Validators.maxLength(100)]),
    excerpt: new FormControl<string>('', [Validators.required, Validators.maxLength(250)]),
    content: new FormControl<string>('', [Validators.required]),
  });

  ngOnInit(): void {
    console.log('---- dialog data', this.dialogConfig.data);
  }

  saveNews(): void {
    if (this.form.valid) {
      this.isSaving = true;

      // Simulate saving process
      setTimeout(() => {
        this.isSaving = false;
        this.dialogRef.close(this.form.value);
      }, 2000); 
    }
  }
}
