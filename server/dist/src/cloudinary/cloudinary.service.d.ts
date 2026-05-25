import { UploadApiResponse } from 'cloudinary';
export declare class CloudinaryService {
    uploadFile(file: Express.Multer.File, folder: string): Promise<UploadApiResponse>;
    deleteFile(publicId: string): Promise<void>;
}
