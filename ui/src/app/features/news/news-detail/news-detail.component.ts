import { ChangeDetectorRef, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { GalleriaModule } from 'primeng/galleria';
import { ButtonModule } from 'primeng/button';
import { NewsService } from '../../../core/services/news.service';
import { News } from '../../../core/models/news.model';
import { MSG_CONFIG } from '../../../core/const';
import { LoaderComponent } from '../../../shared/components';
import { StaticUrlPipe } from '../../../shared/pipes';
import { AuthService } from '../../../core/services';

@Component({
  selector: 'app-news-detail',
	templateUrl: './news-detail.component.html',
	styleUrls: ['./news-detail.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ToastModule,
    ButtonModule,
    LoaderComponent,
    StaticUrlPipe,
    GalleriaModule,
  ],
  providers: [
    MessageService,
  ],
  host: { class: 'block w-full' },
})
export class NewsDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private newsService = inject(NewsService);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);

  news: News = {} as News;
  loading = true;
  error = '';
  canEdit = false;

  responsiveOptions = [
    { breakpoint: '1024px', numVisible: 5 },
    { breakpoint: '768px', numVisible: 3 },
    { breakpoint: '560px', numVisible: 1 }
  ];

  ngOnInit(): void {
    this.loadNews();
  }

  loadNews(): void {
    this.route.params
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap(({ id }) => this.newsService.getNewsById(id)),
      )
      .subscribe({
        next: (data) => {
          if (!data) return;
          this.news = data;
          this.loading = false;
          this.canEdit = this.authService.currentUser()?.id === this.news.userId;
          this.cdr.markForCheck();
        },
        error: () => {
          this.messageService.add(MSG_CONFIG.defaultError);
          this.loading = false;
          this.cdr.markForCheck();
        },
      });
  }

  edit(newsId: string): void {
    this.router.navigate(['/news', newsId, 'edit']);
  }
}
