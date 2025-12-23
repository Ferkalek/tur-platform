import { ChangeDetectorRef, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { NewsService } from '../../core/services/news.service';
import { News } from '../../core/models/news.model';

@Component({
  selector: 'app-news',
	templateUrl: './news.component.html',
	styleUrls: ['./news.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink],
	})
export class NewsComponent implements OnInit {
  private newsService = inject(NewsService);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);

  newsList: News[] = [];
  loading = true;
  error = '';

  ngOnInit() {
    this.loadNews();
  }

  loadNews() {
    this.newsService.getNews()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.loading = false;
          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: (data) => {
          this.newsList = data;
        },
        error: () => {
          this.error = 'Помилка завантаження новин';
        },
      });
  }
}