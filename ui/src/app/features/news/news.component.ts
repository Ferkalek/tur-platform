import { ChangeDetectorRef, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { NewsService } from '../../core/services/news.service';
import { News } from '../../core/models/news.model';
import { MSG_CONFIG } from '../../core/const';
import { LoaderComponent } from '../../shared/components';

@Component({
  selector: 'app-news',
	templateUrl: './news.component.html',
	styleUrls: ['./news.component.scss'],
  host: { class: 'block w-full' },
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ToastModule,
    LoaderComponent,
  ],
  providers: [
    MessageService,
  ]
})
export class NewsComponent implements OnInit {
  private newsService = inject(NewsService);
  private messageService = inject(MessageService);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);

  newsList: News[] = [];
  loading = true;

  ngOnInit(): void {
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
        next: (data) => this.newsList = data,
        error: () => this.messageService.add(MSG_CONFIG.defaultError),
      });
  }
}