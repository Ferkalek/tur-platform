import { ChangeDetectorRef, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { ProfileService } from '../../core/services/profile.service';
import { UserProfile } from '../../core/models/user.model';

@Component({
  selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class ProfileComponent implements OnInit {
  private profileService = inject(ProfileService);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);

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
    this.profileService.getProfile()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.loading = false;
          this.cdr.markForCheck();
        }),
      )
      .subscribe(data => this.profile = data);
  }

  saveProfile() {
    this.saving = true;
    this.saveMessage = '';

    this.profileService.updateProfile(this.profile)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.loading = false;
          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: () => {
          this.saveMessage = 'Зміни успішно збережено!';
          setTimeout(() => (this.saveMessage = ''), 3000);
        },
        error: () => {
          this.saveMessage = 'Помилка збереження';
        },
      });
  }
}
