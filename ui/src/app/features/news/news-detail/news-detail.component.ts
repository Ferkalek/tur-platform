import { ChangeDetectorRef, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { NewsService } from '../../../core/services/news.service';
import { News } from '../../../core/models/news.model';
import { MSG_CONFIG } from '../../../core/const';
import { LoaderComponent } from '../../../shared/components';
import { StaticUrlPipe } from '../../../shared/pipes';

@Component({
  selector: 'app-news-detail',
	templateUrl: './news-detail.component.html',
	styleUrls: ['./news-detail.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ToastModule,
    LoaderComponent,
    StaticUrlPipe,
],
  providers: [
    MessageService,
  ]
})
export class NewsDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private newsService = inject(NewsService);
  private messageService = inject(MessageService);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);

  news: News = {} as News;
  loading = true;
  error = '';

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
          this.cdr.markForCheck();
        },
        error: () => {
          this.messageService.add(MSG_CONFIG.defaultError);
          this.loading = false;
          this.cdr.markForCheck();
        },
      });
  }
}
