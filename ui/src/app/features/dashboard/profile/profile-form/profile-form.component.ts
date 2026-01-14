import { ChangeDetectorRef, Component, DestroyRef, inject, OnInit } from '@angular/core';
// import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
// import { finalize } from 'rxjs';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { ProfileService } from '../../../core/services';
// import { UserProfile } from '../../../core/models';

@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss'],
  standalone: true,
  // imports: [CommonModule, FormsModule],
})
export class ProfileFormComponent implements OnInit {
  // private profileService = inject(ProfileService);
  // private destroyRef = inject(DestroyRef);
  // private cdr = inject(ChangeDetectorRef);

  // profile: UserProfile;
  // loading = true;
  // saving = false;
  // saveMessage = '';

  ngOnInit(): void {
    // this.loadProfile();
  }

  // loadProfile(): void {
  //   this.profileService.getProfile()
  //     .pipe(
  //       takeUntilDestroyed(this.destroyRef),
  //       finalize(() => {
  //         this.loading = false;
  //         this.cdr.markForCheck();
  //       }),
  //     )
  //     .subscribe(data => {
  //       if (data) {
  //         this.profile = data;
  //       }
  //     });
  // }

  // saveProfile(): void {
  //   this.saving = true;
  //   this.saveMessage = '';

  //   const { id, createdAt, updatedAt, ...otherData } = this.profile;

  //   this.profileService.updateProfile({ ...otherData })
  //     .pipe(
  //       takeUntilDestroyed(this.destroyRef),
  //       finalize(() => {
  //         this.loading = false;
  //         this.cdr.markForCheck();
  //       }),
  //     )
  //     .subscribe({
  //       next: () => {
  //         this.saveMessage = 'Зміни успішно збережено!';
  //         setTimeout(() => (this.saveMessage = ''), 3000);
  //       },
  //       error: () => {
  //         this.saveMessage = 'Помилка збереження';
  //       },
  //     });
  // }
}