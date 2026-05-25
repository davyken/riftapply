import { BadRequestException } from '@nestjs/common';
import { memoryStorage } from 'multer';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
  'application/pdf',
];

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB per file

export const multerOptions = {
  storage: memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
    files: 10,        // max 10 files per request
    fields: 20,       // max 20 non-file fields
  },
  fileFilter: (
    _req: any,
    file: Express.Multer.File,
    callback: (error: Error | null, accept: boolean) => void,
  ) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      callback(
        new BadRequestException(
          `File type "${file.mimetype}" is not allowed. Accepted: PDF, JPEG, PNG, WebP, SVG`,
        ),
        false,
      );
    } else {
      callback(null, true);
    }
  },
};
