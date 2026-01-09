import { ToastMessageOptions } from 'primeng/api';

type MessageType = 'unauthorize'
  | 'defaultError'
  | 'createNewsError'
  | 'createNewsSuccess'
  | 'updateNewsError'
  | 'updateNewsSuccess'
  | 'deleteNewsError'
  | 'deleteNewsSuccess';

export const MSG_CONFIG: { [K in MessageType]: ToastMessageOptions } = {
  unauthorize: {
    severity: 'warning',
    summary: 'Unauthorize',
    detail: 'Your session is ended.',
  },
  createNewsSuccess: {
    severity: 'success',
    summary: 'Created News',
    detail: 'News item has been created successfully.',
  },
  createNewsError: {
    severity: 'error',
    summary: 'Create News',
    detail: 'Error creating news item.',
  },
  updateNewsSuccess: {
    severity: 'success',
    summary: 'Updated News',
    detail: 'News item has been updated successfully.',
  },
  updateNewsError: {},
  defaultError: {
    severity: 'error',
    summary: 'Error',
    detail: 'Something went wrong!',
  },
  deleteNewsError: {
    severity: 'error',
    summary: 'Deleted News',
    detail: 'Error deleting news item.',
  },
  deleteNewsSuccess: {
    severity: 'success',
    summary: 'Deleted News',
    detail: 'News item has been deleted successfully.',
  }
};
