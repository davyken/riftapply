import { AuthService } from './auth.service';
import { Model } from 'mongoose';
import { RegisterStudentDto, RegisterAgentDto, RegisterUniversityDto, LoginDto } from './dto/register.dto';
declare class VerifyEmailDto {
    email: string;
    code: string;
    role: string;
}
declare class ResendCodeDto {
    email: string;
    role: string;
}
declare class ForgotPasswordDto {
    email: string;
    role: string;
}
declare class ResetPasswordDto {
    email: string;
    code: string;
    newPassword: string;
    role: string;
}
export declare class AuthController {
    private authService;
    private userModel;
    constructor(authService: AuthService, userModel: Model<any>);
    seedAdmin(): Promise<{
        message: string;
    }>;
    registerStudent(dto: RegisterStudentDto, avatar?: Express.Multer.File): Promise<{
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
    registerUniversity(dto: RegisterUniversityDto, logo: Express.Multer.File): Promise<{
        message: string;
        email: string;
        requiresVerification: boolean;
    }>;
    verifyEmail(dto: VerifyEmailDto): Promise<{
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
    resendVerificationCode(dto: ResendCodeDto): Promise<{
        message: string;
    }>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    getAvatar(name: string, res: any): Promise<any>;
    login(dto: LoginDto): Promise<{
        token: string;
        user: any;
        role: string;
    }>;
}
export {};
