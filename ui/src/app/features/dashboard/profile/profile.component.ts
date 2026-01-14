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
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AuthService, ProfileService } from '../../../core/services';
import { UserProfile } from '../../../core/models';
import { LoaderComponent } from '../../../shared/components';
import { MSG_CONFIG } from '../../../core/const';

@Component({
  selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    LoaderComponent,
    ToastModule,
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
        error: (error) => {
          if (error?.error.statusCode === 401 || error?.statusCode === 401) {
            this.messageService.add(MSG_CONFIG.unauthorize);
            setTimeout(() => this.authService.logout(), 1000);
          }
        }
      });
  }
}
