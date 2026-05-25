"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const user_schema_1 = require("../users/schemas/user.schema");
const agent_schema_1 = require("../agents/schemas/agent.schema");
const university_schema_1 = require("../universities/schemas/university.schema");
const cloudinary_service_1 = require("../cloudinary/cloudinary.service");
const enums_1 = require("../common/enums");
let AuthService = class AuthService {
    userModel;
    agentModel;
    universityModel;
    jwtService;
    cloudinaryService;
    constructor(userModel, agentModel, universityModel, jwtService, cloudinaryService) {
        this.userModel = userModel;
        this.agentModel = agentModel;
        this.universityModel = universityModel;
        this.jwtService = jwtService;
        this.cloudinaryService = cloudinaryService;
    }
    async registerStudent(dto, avatarFile) {
        const exists = await this.userModel.findOne({ email: dto.email });
        if (exists)
            throw new common_1.ConflictException('Email already in use');
        let avatarUrl = `/api/auth/avatar?name=${encodeURIComponent(dto.firstName + ' ' + dto.lastName)}`;
        if (avatarFile) {
            const result = await this.cloudinaryService.uploadFile(avatarFile, 'students/avatars');
            avatarUrl = result.secure_url;
        }
        const hashed = await bcrypt.hash(dto.password, 10);
        const user = await this.userModel.create({
            ...dto,
            password: hashed,
            avatar: avatarUrl,
            role: enums_1.UserRole.STUDENT,
            status: enums_1.AccountStatus.ACTIVE,
        });
        const token = this.signToken(String(user._id), user.email, enums_1.UserRole.STUDENT);
        return { token, user: this.sanitize(user) };
    }
    async registerAgent(dto, files) {
        const exists = await this.agentModel.findOne({ email: dto.email });
        if (exists)
            throw new common_1.ConflictException('Email already in use');
        if (dto.agentType === enums_1.AgentType.PERSONAL && !files?.cniDocument?.[0]) {
            throw new common_1.BadRequestException('CNI document is required for personal accounts');
        }
        if (dto.agentType === enums_1.AgentType.COMPANY && !files?.registrationDocument?.[0]) {
            throw new common_1.BadRequestException('Registration document is required for company accounts');
        }
        const hashed = await bcrypt.hash(dto.password, 10);
        let avatarUrl = `/api/auth/avatar?name=${encodeURIComponent(dto.firstName + ' ' + dto.lastName)}`;
        if (files?.avatar?.[0]) {
            const result = await this.cloudinaryService.uploadFile(files.avatar[0], 'agents/avatars');
            avatarUrl = result.secure_url;
        }
        const agentData = {
            ...dto,
            password: hashed,
            avatar: avatarUrl,
            status: enums_1.AccountStatus.PENDING,
        };
        if (dto.agentType === enums_1.AgentType.PERSONAL && files?.cniDocument?.[0]) {
            const result = await this.cloudinaryService.uploadFile(files.cniDocument[0], 'agents/cni');
            agentData.cniDocument = result.secure_url;
        }
        if (dto.agentType === enums_1.AgentType.COMPANY && files?.registrationDocument?.[0]) {
            const result = await this.cloudinaryService.uploadFile(files.registrationDocument[0], 'agents/registration');
            agentData.registrationDocument = result.secure_url;
        }
        const agent = await this.agentModel.create(agentData);
        return { message: 'Account created and pending admin verification', agent: this.sanitize(agent) };
    }
    async registerUniversity(dto, logo) {
        const exists = await this.universityModel.findOne({ email: dto.email });
        if (exists)
            throw new common_1.ConflictException('Email already in use');
        const hashed = await bcrypt.hash(dto.password, 10);
        const uniData = { ...dto, password: hashed, status: enums_1.AccountStatus.PENDING };
        if (logo) {
            const result = await this.cloudinaryService.uploadFile(logo, 'universities/logos');
            uniData.logo = result.secure_url;
        }
        const university = await this.universityModel.create(uniData);
        return { message: 'University registered and pending admin verification', university: this.sanitize(university) };
    }
    async login(dto) {
        let user;
        let role = dto.role;
        if (role === 'student' || role === 'admin') {
            user = await this.userModel.findOne({ email: dto.email });
        }
        else if (role === 'agent') {
            user = await this.agentModel.findOne({ email: dto.email });
        }
        else if (role === 'university') {
            user = await this.universityModel.findOne({ email: dto.email });
        }
        else {
            throw new common_1.BadRequestException('Invalid role');
        }
        if (!user)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const passwordValid = await bcrypt.compare(dto.password, user.password);
        if (!passwordValid)
            throw new common_1.UnauthorizedException('Invalid credentials');
        if (user.status === enums_1.AccountStatus.PENDING) {
            throw new common_1.UnauthorizedException('Account pending admin approval');
        }
        if (user.status === enums_1.AccountStatus.REJECTED) {
            throw new common_1.UnauthorizedException('Account has been rejected');
        }
        if (user.status === enums_1.AccountStatus.BLOCKED) {
            throw new common_1.UnauthorizedException('Account has been blocked');
        }
        const token = this.signToken(String(user._id), user.email, role);
        return { token, user: this.sanitize(user), role };
    }
    signToken(userId, email, role) {
        return this.jwtService.sign({ sub: userId, email, role });
    }
    sanitize(doc) {
        const obj = doc.toObject ? doc.toObject() : doc;
        delete obj.password;
        return obj;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(agent_schema_1.Agent.name)),
    __param(2, (0, mongoose_1.InjectModel)(university_schema_1.University.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        jwt_1.JwtService,
        cloudinary_service_1.CloudinaryService])
], AuthService);
//# sourceMappingURL=auth.service.js.map