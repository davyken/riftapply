export declare const multerOptions: {
    storage: import("multer").StorageEngine;
    limits: {
        fileSize: number;
        files: number;
        fields: number;
    };
    fileFilter: (_req: any, file: Express.Multer.File, callback: (error: Error | null, accept: boolean) => void) => void;
};
