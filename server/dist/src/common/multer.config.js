"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerOptions = void 0;
const common_1 = require("@nestjs/common");
const multer_1 = require("multer");
const ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/svg+xml',
    'application/pdf',
];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
exports.multerOptions = {
    storage: (0, multer_1.memoryStorage)(),
    limits: {
        fileSize: MAX_FILE_SIZE_BYTES,
        files: 10,
        fields: 20,
    },
    fileFilter: (_req, file, callback) => {
        if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
            callback(new common_1.BadRequestException(`File type "${file.mimetype}" is not allowed. Accepted: PDF, JPEG, PNG, WebP, SVG`), false);
        }
        else {
            callback(null, true);
        }
    },
};
//# sourceMappingURL=multer.config.js.map