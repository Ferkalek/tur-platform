import {
  // ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  // DestroyRef,
  OnInit,
  // inject
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DialogService } from 'primeng/dynamicdialog';
import { NewsFormComponent } from '../news/news-form/news-form.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
// import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
// import { finalize } from 'rxjs';
// import { ProfileService } from '../../core/services/profile.service';
// import { UserProfile } from '../../core/models';

@Component({
  selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [ButtonModule, DialogModule],
  providers: [DialogService],
})
export class ProfileComponent implements OnInit {
  private dialogService = inject(DialogService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {}

  addNews(): void {
    const dialogRef = this.dialogService.open(NewsFormComponent, {
      header: 'Add News',
      width: '700px',
      data: {
        title: 'New News Item',
        excerpt: 'Excerpt goes here...',
        content: 'Content goes here...'
      }
    });
    
    dialogRef?.onClose
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        if (result) {
          console.log('---News added:', result);
        }
      });
  }
}
