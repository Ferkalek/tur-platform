import { diskStorage } from 'multer';
import { extname } from 'path';
import { BadRequestException } from '@nestjs/common';

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

// file's type validation
export const imageFileFilter = (req: any, file: any, callback: any) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
  if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
    return callback(
      new BadRequestException('Дозволені тільки зображення (JPEG, PNG, WebP)'),
      false,
    );
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  callback(null, true);
};

// Generate uniq name of file
const generateFileName = (req: any, file: any, callback: any) => {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
  const ext = extname(file.originalname);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  callback(null, filename);
};

// config for avatars
export const avatarMulterConfig = {
  storage: diskStorage({
    destination: './uploads/avatars',
    filename: generateFileName,
  }),
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
};

// config for news images
export const newsImagesMulterConfig = {
  storage: diskStorage({
    destination: './uploads/news',
    filename: generateFileName,
  }),
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 5, // max 5 files
  },
};
