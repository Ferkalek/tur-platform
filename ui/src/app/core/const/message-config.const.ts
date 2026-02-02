import { ToastMessageOptions } from 'primeng/api';

type MessageType = 'unauthorize'
  | 'defaultError'
  | 'createNewsError'
  | 'createNewsSuccess'
  | 'updateNewsError'
  | 'updateNewsSuccess'
  | 'deleteNewsError'
  | 'deleteNewsSuccess'
  | 'updateProfileSuccess'
  | 'updateProfileError'
  | 'wrongFileType'
  | 'maxFileSize'
  | 'updateAvatarError'
  | 'updateAvatarSuccess'
  | 'deleteAvatarSuccess'
  | 'deleteAvatarError'
  | 'uploadingFilesSuccess'
  | 'uploadingFilesError'
  | 'deleteImageSuccess'
  | 'deleteImageError';

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
  },
  updateProfileSuccess: {
    severity: 'success',
    summary: 'Updated Profile',
    detail: 'Profile has been updated successfully.',
  },
  updateProfileError: {
    severity: 'Error',
    summary: 'Updated Profile',
    detail: 'Error updating Profile.',
  },
  wrongFileType: {
    severity: 'warn',
    summary: 'Wrong type',
    detail: 'Please, choose file type JPG, PNG, or WEBP',
  },
  maxFileSize: {
    severity: 'warn',
    summary: 'File size',
    detail: 'Maximum file size is 5MB',
  },
  updateAvatarSuccess: {
    severity: 'success',
    summary: 'Updated Avatar',
    detail: 'Avatar has been updated successfully.',
  },
  updateAvatarError: {
    severity: 'error',
    summary: 'Updated Avatar',
    detail: 'Error updating Avatar.',
  },
  deleteAvatarSuccess: {
    severity: 'success',
    summary: 'Deletting',
    detail: 'Avatar has been deleted succsessfully',
  },
  deleteAvatarError: {
    severity: 'error',
    summary: 'Deletting',
    detail: 'Error deleting Avatar'
  },
  uploadingFilesSuccess: {
    severity: 'success',
    summary: 'Uploading files',
    detail: 'Files have been uploaded succsessfully',
  },
  uploadingFilesError: {
    severity: 'error',
    summary: 'Error',
    detail: 'Error uploading files'
  },
  deleteImageSuccess: {
    severity: 'success',
    summary: 'Deleted Image',
    detail: 'Image has been deleted successfully.',
  },
  deleteImageError: {
    severity: 'error',
    summary: 'Deleting Image',
    detail: 'Error deleting image'
  },
};
