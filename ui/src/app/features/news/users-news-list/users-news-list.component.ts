import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { News } from '../../../core/models';
import { USERS_NEWS_TABLE_COLUMNS } from './table.config';

@Component({
  selector: 'app-users-news-list',
  templateUrl: './users-news-list.component.html',
  styleUrls: ['./users-news-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
  ],
})
export class UsersNewsListComponent {
  @Input() newsList: News[] = [];

  @Output() editNews = new EventEmitter<News>();
  @Output() deleteNews = new EventEmitter<string>();

  cols = USERS_NEWS_TABLE_COLUMNS;
}