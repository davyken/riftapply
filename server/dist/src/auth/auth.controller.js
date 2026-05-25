"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const throttler_1 = require("@nestjs/throttler");
const auth_service_1 = require("./auth.service");
const register_dto_1 = require("./dto/register.dto");
const multer_config_1 = require("../common/multer.config");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    registerStudent(dto, avatar) {
        return this.authService.registerStudent(dto, avatar);
    }
    registerAgent(dto, files) {
        return this.authService.registerAgent(dto, files);
    }
    registerUniversity(dto, logo) {
        return this.authService.registerUniversity(dto, logo);
    }
    async getAvatar(name, res) {
        const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || 'User')}`;
        return res.redirect(avatarUrl);
    }
    login(dto) {
        return this.authService.login(dto);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register/student'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('avatar', multer_config_1.multerOptions)),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterStudentDto, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "registerStudent", null);
__decorate([
    (0, common_1.Post)('register/agent'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'cniDocument', maxCount: 1 },
        { name: 'registrationDocument', maxCount: 1 },
        { name: 'avatar', maxCount: 1 },
    ], multer_config_1.multerOptions)),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterAgentDto, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "registerAgent", null);
__decorate([
    (0, common_1.Post)('register/university'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('logo', multer_config_1.multerOptions)),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterUniversityDto, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "registerUniversity", null);
__decorate([
    (0, common_1.Get)('avatar'),
    __param(0, (0, common_1.Query)('name')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getAvatar", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, throttler_1.Throttle)({ auth: { ttl: 60000, limit: 10 } }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.LoginDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "login", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map