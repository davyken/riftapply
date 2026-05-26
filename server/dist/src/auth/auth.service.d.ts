import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from '../users/schemas/user.schema';
import { AgentDocument } from '../agents/schemas/agent.schema';
import { UniversityDocument } from '../universities/schemas/university.schema';
import { OtpDocument } from './schemas/otp.schema';
import { RegisterStudentDto, RegisterAgentDto, RegisterUniversityDto, LoginDto } from './dto/register.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { MailService } from '../mail/mail.service';
export declare class AuthService {
    private userModel;
    private agentModel;
    private universityModel;
    private otpModel;
    private jwtService;
    private cloudinaryService;
    private mailService;
    constructor(userModel: Model<UserDocument>, agentModel: Model<AgentDocument>, universityModel: Model<UniversityDocument>, otpModel: Model<OtpDocument>, jwtService: JwtService, cloudinaryService: CloudinaryService, mailService: MailService);
    registerStudent(dto: RegisterStudentDto, avatarFile?: Express.Multer.File): Promise<{
        message: string;
        email: string;
        requiresVerification: boolean;
    }>;
    registerAgent(dto: RegisterAgentDto, files: {
        cniDocument?: Express.Multer.File[];
        registrationDocument?: Express.Multer.File[];
        avatar?: Express.Multer.File[];
    }): Promise<{
        message: string;
        email: string;
        requiresVerification: boolean;
    }>;
    registerUniversity(dto: RegisterUniversityDto, logo?: Express.Multer.File): Promise<{
        message: string;
        email: string;
        requiresVerification: boolean;
    }>;
    verifyEmail(email: string, code: string, role: string): Promise<{
        verified: boolean;
        pendingApproval: boolean;
        token: string;
        user: any;
        role: string;
        message?: undefined;
    } | {
        verified: boolean;
        pendingApproval: boolean;
        message: string;
        token?: undefined;
        user?: undefined;
        role?: undefined;
    }>;
    resendVerificationCode(email: string, role: string): Promise<{
        message: string;
    }>;
    forgotPassword(email: string, role: string): Promise<{
        message: string;
    }>;
    resetPassword(email: string, code: string, newPassword: string, role: string): Promise<{
        message: string;
    }>;
    login(dto: LoginDto): Promise<{
        token: string;
        user: any;
        role: string;
    }>;
    private sendOtp;
    private unsetVerificationExpiry;
    private extendVerificationExpiry;
    private getModelForRole;
    private findUserByEmailAndRole;
    private signToken;
    private sanitize;
}
