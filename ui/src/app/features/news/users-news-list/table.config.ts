import { NewsColumn } from '../../../core/models'

export const USERS_NEWS_TABLE_COLUMNS: NewsColumn[] = [
  { field: 'title', header: 'Title' },
  { field: 'excerpt', header: 'Excerpt' },
  { field: 'createdAt', header: 'Date Created', style: 'width: 13rem' },
  { field: 'edit', header: 'Edit', isAction: true },
  { field: 'delete', header: 'Delete', isAction: true },
];
