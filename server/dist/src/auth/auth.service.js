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
const otp_schema_1 = require("./schemas/otp.schema");
const cloudinary_service_1 = require("../cloudinary/cloudinary.service");
const mail_service_1 = require("../mail/mail.service");
const enums_1 = require("../common/enums");
const VERIFICATION_WINDOW_MS = 5 * 60 * 1000;
function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
function otpExpiry() {
    return new Date(Date.now() + VERIFICATION_WINDOW_MS);
}
let AuthService = class AuthService {
    userModel;
    agentModel;
    universityModel;
    otpModel;
    jwtService;
    cloudinaryService;
    mailService;
    constructor(userModel, agentModel, universityModel, otpModel, jwtService, cloudinaryService, mailService) {
        this.userModel = userModel;
        this.agentModel = agentModel;
        this.universityModel = universityModel;
        this.otpModel = otpModel;
        this.jwtService = jwtService;
        this.cloudinaryService = cloudinaryService;
        this.mailService = mailService;
    }
    async registerStudent(dto, avatarFile) {
        const exists = await this.userModel.findOne({ email: dto.email.toLowerCase() });
        if (exists)
            throw new common_1.ConflictException('Email already in use');
        let avatarUrl = `/api/auth/avatar?name=${encodeURIComponent(dto.firstName + ' ' + dto.lastName)}`;
        if (avatarFile) {
            const result = await this.cloudinaryService.uploadFile(avatarFile, 'students/avatars');
            avatarUrl = result.secure_url;
        }
        const hashed = await bcrypt.hash(dto.password, 10);
        await this.userModel.create({
            ...dto,
            email: dto.email.toLowerCase(),
            password: hashed,
            avatar: avatarUrl,
            role: enums_1.UserRole.STUDENT,
            status: enums_1.AccountStatus.ACTIVE,
            emailVerified: false,
            verificationExpiry: otpExpiry(),
        });
        await this.sendOtp(dto.email.toLowerCase(), otp_schema_1.OtpType.EMAIL_VERIFICATION, 'student', dto.firstName);
        return {
            message: 'Registration successful! Please check your email for a verification code.',
            email: dto.email.toLowerCase(),
            requiresVerification: true,
        };
    }
    async registerAgent(dto, files) {
        const exists = await this.agentModel.findOne({ email: dto.email.toLowerCase() });
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
            email: dto.email.toLowerCase(),
            password: hashed,
            avatar: avatarUrl,
            status: enums_1.AccountStatus.PENDING,
            emailVerified: false,
            verificationExpiry: otpExpiry(),
        };
        if (dto.agentType === enums_1.AgentType.PERSONAL && files?.cniDocument?.[0]) {
            const result = await this.cloudinaryService.uploadFile(files.cniDocument[0], 'agents/cni');
            agentData.cniDocument = result.secure_url;
        }
        if (dto.agentType === enums_1.AgentType.COMPANY && files?.registrationDocument?.[0]) {
            const result = await this.cloudinaryService.uploadFile(files.registrationDocument[0], 'agents/registration');
            agentData.registrationDocument = result.secure_url;
        }
        await this.agentModel.create(agentData);
        await this.sendOtp(dto.email.toLowerCase(), otp_schema_1.OtpType.EMAIL_VERIFICATION, 'agent', dto.firstName);
        return {
            message: 'Registration successful! Please check your email for a verification code.',
            email: dto.email.toLowerCase(),
            requiresVerification: true,
        };
    }
    async registerUniversity(dto, logo) {
        const exists = await this.universityModel.findOne({ email: dto.email.toLowerCase() });
        if (exists)
            throw new common_1.ConflictException('Email already in use');
        const hashed = await bcrypt.hash(dto.password, 10);
        const uniData = {
            ...dto,
            email: dto.email.toLowerCase(),
            password: hashed,
            status: enums_1.AccountStatus.PENDING,
            emailVerified: false,
            verificationExpiry: otpExpiry(),
        };
        if (logo) {
            const result = await this.cloudinaryService.uploadFile(logo, 'universities/logos');
            uniData.logo = result.secure_url;
        }
        await this.universityModel.create(uniData);
        await this.sendOtp(dto.email.toLowerCase(), otp_schema_1.OtpType.EMAIL_VERIFICATION, 'university', dto.name);
        return {
            message: 'Registration successful! Please check your email for a verification code.',
            email: dto.email.toLowerCase(),
            requiresVerification: true,
        };
    }
    async verifyEmail(email, code, role) {
        const normalizedEmail = email.toLowerCase();
        const otp = await this.otpModel.findOne({
            email: normalizedEmail,
            type: otp_schema_1.OtpType.EMAIL_VERIFICATION,
            role,
            used: false,
        }).sort({ createdAt: -1 });
        if (!otp)
            throw new common_1.BadRequestException('No verification code found. Please request a new one.');
        if (otp.expiresAt < new Date())
            throw new common_1.BadRequestException('Verification code has expired. Please request a new one.');
        if (otp.code !== code)
            throw new common_1.BadRequestException('Invalid verification code.');
        otp.used = true;
        await otp.save();
        const user = await this.findUserByEmailAndRole(normalizedEmail, role);
        if (!user) {
            throw new common_1.BadRequestException('Your registration has expired. Please register again.');
        }
        user.emailVerified = true;
        await user.save();
        await this.unsetVerificationExpiry(normalizedEmail, role);
        if (role === 'student' || role === 'admin') {
            const token = this.signToken(String(user._id), normalizedEmail, role);
            return {
                verified: true,
                pendingApproval: false,
                token,
                user: this.sanitize(user),
                role,
            };
        }
        return {
            verified: true,
            pendingApproval: true,
            message: 'Email verified! Your account is now pending admin approval. You will be notified once approved.',
        };
    }
    async resendVerificationCode(email, role) {
        const normalizedEmail = email.toLowerCase();
        const user = await this.findUserByEmailAndRole(normalizedEmail, role);
        if (!user) {
            throw new common_1.BadRequestException('Your registration has expired. Please register again.');
        }
        if (user.emailVerified)
            throw new common_1.BadRequestException('Email is already verified.');
        await this.extendVerificationExpiry(normalizedEmail, role);
        const name = user.firstName || user.name || normalizedEmail;
        await this.sendOtp(normalizedEmail, otp_schema_1.OtpType.EMAIL_VERIFICATION, role, name);
        return { message: 'A new verification code has been sent to your email.' };
    }
    async forgotPassword(email, role) {
        const normalizedEmail = email.toLowerCase();
        const user = await this.findUserByEmailAndRole(normalizedEmail, role);
        if (!user)
            return { message: 'If an account exists with this email, a reset code has been sent.' };
        const name = user.firstName || user.name || normalizedEmail;
        await this.sendOtp(normalizedEmail, otp_schema_1.OtpType.PASSWORD_RESET, role, name, true);
        return { message: 'If an account exists with this email, a reset code has been sent.' };
    }
    async resetPassword(email, code, newPassword, role) {
        const normalizedEmail = email.toLowerCase();
        const otp = await this.otpModel.findOne({
            email: normalizedEmail,
            type: otp_schema_1.OtpType.PASSWORD_RESET,
            role,
            used: false,
        }).sort({ createdAt: -1 });
        if (!otp)
            throw new common_1.BadRequestException('No reset code found. Please request a new one.');
        if (otp.expiresAt < new Date())
            throw new common_1.BadRequestException('Reset code has expired. Please request a new one.');
        if (otp.code !== code)
            throw new common_1.BadRequestException('Invalid reset code.');
        otp.used = true;
        await otp.save();
        const hashed = await bcrypt.hash(newPassword, 10);
        const user = await this.findUserByEmailAndRole(normalizedEmail, role);
        if (!user)
            throw new common_1.NotFoundException('Account not found.');
        user.password = hashed;
        await user.save();
        return { message: 'Password reset successfully. You can now log in with your new password.' };
    }
    async login(dto) {
        let user;
        const role = dto.role;
        if (role === 'student' || role === 'admin') {
            user = await this.userModel.findOne({ email: dto.email.toLowerCase() });
        }
        else if (role === 'agent') {
            user = await this.agentModel.findOne({ email: dto.email.toLowerCase() });
        }
        else if (role === 'university') {
            user = await this.universityModel.findOne({ email: dto.email.toLowerCase() });
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
    async sendOtp(email, type, role, name, isReset = false) {
        await this.otpModel.updateMany({ email, type, role, used: false }, { used: true });
        const code = generateOtp();
        await this.otpModel.create({ email, code, type, role, expiresAt: otpExpiry() });
        if (isReset) {
            await this.mailService.sendPasswordResetCode(email, code, name);
        }
        else {
            await this.mailService.sendVerificationCode(email, code, name);
        }
    }
    async unsetVerificationExpiry(email, role) {
        const model = this.getModelForRole(role);
        if (model) {
            await model.updateOne({ email }, { $unset: { verificationExpiry: '' } });
        }
    }
    async extendVerificationExpiry(email, role) {
        const model = this.getModelForRole(role);
        if (model) {
            await model.updateOne({ email }, { verificationExpiry: otpExpiry() });
        }
    }
    getModelForRole(role) {
        if (role === 'student' || role === 'admin')
            return this.userModel;
        if (role === 'agent')
            return this.agentModel;
        if (role === 'university')
            return this.universityModel;
        return null;
    }
    async findUserByEmailAndRole(email, role) {
        if (role === 'student' || role === 'admin') {
            return this.userModel.findOne({ email });
        }
        else if (role === 'agent') {
            return this.agentModel.findOne({ email });
        }
        else if (role === 'university') {
            return this.universityModel.findOne({ email });
        }
        return null;
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
    __param(3, (0, mongoose_1.InjectModel)(otp_schema_1.Otp.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        jwt_1.JwtService,
        cloudinary_service_1.CloudinaryService,
        mail_service_1.MailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map