import { Injectable, BadRequestException, RequestTimeoutException } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';

const UPLOAD_TIMEOUT_MS = 30_000; // 30 seconds — hung uploads release the slot

@Injectable()
export class CloudinaryService {
  async uploadFile(
    file: Express.Multer.File,
    folder: string,
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(
        () => reject(new RequestTimeoutException('File upload timed out')),
        UPLOAD_TIMEOUT_MS,
      );

      const upload = cloudinary.uploader.upload_stream(
        { folder, resource_type: 'auto' },
        (error, result) => {
          clearTimeout(timer);
          if (error || !result)
            reject(new BadRequestException(error?.message ?? 'Upload failed'));
          else resolve(result);
        },
      );

      Readable.from(file.buffer).pipe(upload);
    });
  }

  async deleteFile(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
  }
}
