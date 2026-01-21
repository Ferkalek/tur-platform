import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { MessageService, ToastMessageOptions } from 'primeng/api';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { AvatarModule } from 'primeng/avatar';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { AuthService, ConfigService, ProfileService } from '../../../core/services';
import { UserProfile } from '../../../core/models';
import { LoaderComponent } from '../../../shared/components';
import { MSG_CONFIG } from '../../../core/const';
import { ProfileFormComponent } from './profile-form/profile-form.component';
import { StaticUrlPipe } from '../../../shared/pipes';

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
    AvatarModule,
    FileUploadModule,
    StaticUrlPipe,
  ],
  providers: [
    MessageService,
    ConfigService,
  ],
})
export class ProfileComponent implements OnInit {
  @ViewChild('fileUpload') fileUpload!: FileUpload;

  private profileService = inject(ProfileService);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);

  config = inject(ConfigService);

  profile: UserProfile;
  loading = true;
  isEditFormOpened = false;

  uploadingAvatar = false;
  deletingAvatar = false;

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

  getInitials(): string {
    if (!this.profile.firstName) return '?';
    
    const names = this.profile.firstName.trim().split(' ');

    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }

    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
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
    } = newProfileDate;

    this.profileService.updateProfile({ email, firstName, lastName, phone, bio })
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

  onAvatarSelect(event: any): void {
    const file = event.files[0];
    
    // type file validation
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      this.messageService.add(MSG_CONFIG.wrongFileType);
      this.fileUpload.clear();
      return;
    }

    // file size validation
    if (file.size > 5000000) {
      this.messageService.add(MSG_CONFIG.maxFileSize);
      this.fileUpload.clear();
      return;
    }
  }

  onAvatarUpload(event: any): void {
    const file = event.files[0];
    this.uploadingAvatar = true;

    this.profileService.uploadAvatar(file).subscribe({
      next: (userProfile) => {
        this.profile = userProfile;
        this.cdr.markForCheck();
        this.uploadingAvatar = false;
        this.fileUpload.clear();
        
        this.messageService.add(MSG_CONFIG.updateAvatarSuccess);
      },
      error: () => {
        this.uploadingAvatar = false;
        this.fileUpload.clear();
        
        this.messageService.add(MSG_CONFIG.updateAvatarError);
      }
    });
  }

  onUploadError(): void {
    this.messageService.add(MSG_CONFIG.defaultError);
  }

  deleteAvatar() {
    this.deletingAvatar = true;

    this.profileService.deleteAvatar()
    .pipe(
      takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.deletingAvatar = false;
          this.cdr.markForCheck();
        })
    )
    .subscribe({
      next: (userProfile) => {
        this.profile = userProfile;
        this.messageService.add(MSG_CONFIG.deleteAvatarSuccess);
      },
      error: () => this.messageService.add(MSG_CONFIG.deleteAvatarError),
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
