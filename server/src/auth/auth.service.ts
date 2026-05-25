import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Agent, AgentDocument } from '../agents/schemas/agent.schema';
import { University, UniversityDocument } from '../universities/schemas/university.schema';
import { RegisterStudentDto, RegisterAgentDto, RegisterUniversityDto, LoginDto } from './dto/register.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { UserRole, AccountStatus, AgentType } from '../common/enums';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Agent.name) private agentModel: Model<AgentDocument>,
    @InjectModel(University.name) private universityModel: Model<UniversityDocument>,
    private jwtService: JwtService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async registerStudent(dto: RegisterStudentDto, avatarFile?: Express.Multer.File) {
    const exists = await this.userModel.findOne({ email: dto.email });
    if (exists) throw new ConflictException('Email already in use');

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
      role: UserRole.STUDENT,
      status: AccountStatus.ACTIVE,
    });

    const token = this.signToken(String(user._id), user.email, UserRole.STUDENT);
    return { token, user: this.sanitize(user) };
  }

  async registerAgent(
    dto: RegisterAgentDto,
    files: {
      cniDocument?: Express.Multer.File[];
      registrationDocument?: Express.Multer.File[];
      avatar?: Express.Multer.File[];
    },
  ) {
    const exists = await this.agentModel.findOne({ email: dto.email });
    if (exists) throw new ConflictException('Email already in use');

    if (dto.agentType === AgentType.PERSONAL && !files?.cniDocument?.[0]) {
      throw new BadRequestException('CNI document is required for personal accounts');
    }
    if (dto.agentType === AgentType.COMPANY && !files?.registrationDocument?.[0]) {
      throw new BadRequestException('Registration document is required for company accounts');
    }

    const hashed = await bcrypt.hash(dto.password, 10);
    let avatarUrl = `/api/auth/avatar?name=${encodeURIComponent(dto.firstName + ' ' + dto.lastName)}`;
    if (files?.avatar?.[0]) {
      const result = await this.cloudinaryService.uploadFile(files.avatar[0], 'agents/avatars');
      avatarUrl = result.secure_url;
    }

    const agentData: any = {
      ...dto,
      password: hashed,
      avatar: avatarUrl,
      status: AccountStatus.PENDING,
    };

    if (dto.agentType === AgentType.PERSONAL && files?.cniDocument?.[0]) {
      const result = await this.cloudinaryService.uploadFile(files.cniDocument[0], 'agents/cni');
      agentData.cniDocument = result.secure_url;
    }

    if (dto.agentType === AgentType.COMPANY && files?.registrationDocument?.[0]) {
      const result = await this.cloudinaryService.uploadFile(files.registrationDocument[0], 'agents/registration');
      agentData.registrationDocument = result.secure_url;
    }

    const agent = await this.agentModel.create(agentData);
    return { message: 'Account created and pending admin verification', agent: this.sanitize(agent) };
  }

  async registerUniversity(dto: RegisterUniversityDto, logo?: Express.Multer.File) {
    const exists = await this.universityModel.findOne({ email: dto.email });
    if (exists) throw new ConflictException('Email already in use');

    const hashed = await bcrypt.hash(dto.password, 10);
    const uniData: any = { ...dto, password: hashed, status: AccountStatus.PENDING };

    if (logo) {
      const result = await this.cloudinaryService.uploadFile(logo, 'universities/logos');
      uniData.logo = result.secure_url;
    }

    const university = await this.universityModel.create(uniData);
    return { message: 'University registered and pending admin verification', university: this.sanitize(university) };
  }

  async login(dto: LoginDto) {
    let user: any;
    let role = dto.role;

    if (role === 'student' || role === 'admin') {
      user = await this.userModel.findOne({ email: dto.email });
    } else if (role === 'agent') {
      user = await this.agentModel.findOne({ email: dto.email });
    } else if (role === 'university') {
      user = await this.universityModel.findOne({ email: dto.email });
    } else {
      throw new BadRequestException('Invalid role');
    }

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const passwordValid = await bcrypt.compare(dto.password, user.password);
    if (!passwordValid) throw new UnauthorizedException('Invalid credentials');

    if (user.status === AccountStatus.PENDING) {
      throw new UnauthorizedException('Account pending admin approval');
    }
    if (user.status === AccountStatus.REJECTED) {
      throw new UnauthorizedException('Account has been rejected');
    }
    if (user.status === AccountStatus.BLOCKED) {
      throw new UnauthorizedException('Account has been blocked');
    }

    const token = this.signToken(String(user._id), user.email, role);
    return { token, user: this.sanitize(user), role };
  }

  private signToken(userId: string, email: string, role: string): string {
    return this.jwtService.sign({ sub: userId, email, role });
  }

  private sanitize(doc: any) {
    const obj = doc.toObject ? doc.toObject() : doc;
    delete obj.password;
    return obj;
  }
}
