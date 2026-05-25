"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudinaryService = void 0;
const common_1 = require("@nestjs/common");
const cloudinary_1 = require("cloudinary");
const stream_1 = require("stream");
const UPLOAD_TIMEOUT_MS = 30_000;
let CloudinaryService = class CloudinaryService {
    async uploadFile(file, folder) {
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => reject(new common_1.RequestTimeoutException('File upload timed out')), UPLOAD_TIMEOUT_MS);
            const upload = cloudinary_1.v2.uploader.upload_stream({ folder, resource_type: 'auto' }, (error, result) => {
                clearTimeout(timer);
                if (error || !result)
                    reject(new common_1.BadRequestException(error?.message ?? 'Upload failed'));
                else
                    resolve(result);
            });
            stream_1.Readable.from(file.buffer).pipe(upload);
        });
    }
    async deleteFile(publicId) {
        await cloudinary_1.v2.uploader.destroy(publicId);
    }
};
exports.CloudinaryService = CloudinaryService;
exports.CloudinaryService = CloudinaryService = __decorate([
    (0, common_1.Injectable)()
], CloudinaryService);
//# sourceMappingURL=cloudinary.service.js.map