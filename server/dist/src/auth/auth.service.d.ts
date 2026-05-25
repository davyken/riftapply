import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from '../users/schemas/user.schema';
import { AgentDocument } from '../agents/schemas/agent.schema';
import { UniversityDocument } from '../universities/schemas/university.schema';
import { RegisterStudentDto, RegisterAgentDto, RegisterUniversityDto, LoginDto } from './dto/register.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
export declare class AuthService {
    private userModel;
    private agentModel;
    private universityModel;
    private jwtService;
    private cloudinaryService;
    constructor(userModel: Model<UserDocument>, agentModel: Model<AgentDocument>, universityModel: Model<UniversityDocument>, jwtService: JwtService, cloudinaryService: CloudinaryService);
    registerStudent(dto: RegisterStudentDto, avatarFile?: Express.Multer.File): Promise<{
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
    registerUniversity(dto: RegisterUniversityDto, logo?: Express.Multer.File): Promise<{
        message: string;
        university: any;
    }>;
    login(dto: LoginDto): Promise<{
        token: string;
        user: any;
        role: string;
    }>;
    private signToken;
    private sanitize;
}
