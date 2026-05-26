import { AuthService } from './auth.service';
import { Model } from 'mongoose';
import { RegisterStudentDto, RegisterAgentDto, RegisterUniversityDto, LoginDto } from './dto/register.dto';
export declare class AuthController {
    private authService;
    private userModel;
    constructor(authService: AuthService, userModel: Model<any>);
    seedAdmin(): Promise<{
        message: string;
    }>;
    registerStudent(dto: RegisterStudentDto, avatar?: Express.Multer.File): Promise<{
        token: string;
        user: any;
    }>;
    registerAgent(dto: RegisterAgentDto, files: {
        cniDocument?: Express.Multer.File[];
        registrationDocument?: Express.Multer.File[];
        avatar?: Express.Multer.File[];
    }): Promise<{
        message: string;
        agent: any;
    }>;
    registerUniversity(dto: RegisterUniversityDto, logo: Express.Multer.File): Promise<{
        message: string;
        university: any;
    }>;
    getAvatar(name: string, res: any): Promise<any>;
    login(dto: LoginDto): Promise<{
        token: string;
        user: any;
        role: string;
    }>;
}
