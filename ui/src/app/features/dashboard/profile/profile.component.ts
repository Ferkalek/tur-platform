import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { MessageService, ToastMessageOptions } from 'primeng/api';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { AuthService, ProfileService } from '../../../core/services';
import { UserProfile } from '../../../core/models';
import { LoaderComponent } from '../../../shared/components';
import { MSG_CONFIG } from '../../../core/const';
import { ProfileFormComponent } from './profile-form/profile-form.component';

@Component({
  selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    LoaderComponent,
    DrawerModule,
    ButtonModule,
    ToastModule,    
    ProfileFormComponent,
  ],
  providers: [
    MessageService,
  ],
})
export class ProfileComponent implements OnInit {
  private profileService = inject(ProfileService);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);

  profile: UserProfile;
  loading = true;
  isEditFormOpened = false;

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.profileService.getProfile()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.loading = false;
          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: (data) => {
          if (!data) return;

          this.profile = data;
        },
        error: (error) => this.errorHandler(error, MSG_CONFIG.defaultError),
      });
  }

  saveProfile(newProfileDate: Partial<UserProfile>): void {
    this.isEditFormOpened = false;
    this.loading = true;

    const {
      email = '',
      firstName = '',
      lastName = '',
      phone = '',
      bio = '',
      avatar = '',
      socialLink = '',
    } = newProfileDate;

    this.profileService.updateProfile({ email, firstName, lastName, phone, bio, avatar, socialLink })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.messageService.add(MSG_CONFIG.deleteNewsSuccess);
          this.loadProfile();
        },
        error: (error) => {
          this.loading = false;
          this.errorHandler(error, MSG_CONFIG.updateProfileError);
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
