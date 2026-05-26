import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Agent, AgentDocument } from '../agents/schemas/agent.schema';
import { University, UniversityDocument } from '../universities/schemas/university.schema';
import { Otp, OtpDocument, OtpType } from './schemas/otp.schema';
import { RegisterStudentDto, RegisterAgentDto, RegisterUniversityDto, LoginDto } from './dto/register.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { MailService } from '../mail/mail.service';
import { UserRole, AccountStatus, AgentType } from '../common/enums';

/** Generate a 6-digit numeric OTP */
function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/** 10 minutes from now */
function otpExpiry(): Date {
  const d = new Date();
  d.setMinutes(d.getMinutes() + 10);
  return d;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Agent.name) private agentModel: Model<AgentDocument>,
    @InjectModel(University.name) private universityModel: Model<UniversityDocument>,
    @InjectModel(Otp.name) private otpModel: Model<OtpDocument>,
    private jwtService: JwtService,
    private cloudinaryService: CloudinaryService,
    private mailService: MailService,
  ) {}

  // ─────────────────────────── REGISTER ───────────────────────────

  async registerStudent(dto: RegisterStudentDto, avatarFile?: Express.Multer.File) {
    const exists = await this.userModel.findOne({ email: dto.email.toLowerCase() });
    if (exists) throw new ConflictException('Email already in use');

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
      role: UserRole.STUDENT,
      status: AccountStatus.ACTIVE,
      emailVerified: false,
    });

    await this.sendOtp(dto.email.toLowerCase(), OtpType.EMAIL_VERIFICATION, 'student', dto.firstName);

    return {
      message: 'Registration successful! Please check your email for a verification code.',
      email: dto.email.toLowerCase(),
      requiresVerification: true,
    };
  }

  async registerAgent(
    dto: RegisterAgentDto,
    files: {
      cniDocument?: Express.Multer.File[];
      registrationDocument?: Express.Multer.File[];
      avatar?: Express.Multer.File[];
    },
  ) {
    const exists = await this.agentModel.findOne({ email: dto.email.toLowerCase() });
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
      email: dto.email.toLowerCase(),
      password: hashed,
      avatar: avatarUrl,
      status: AccountStatus.PENDING,
      emailVerified: false,
    };

    if (dto.agentType === AgentType.PERSONAL && files?.cniDocument?.[0]) {
      const result = await this.cloudinaryService.uploadFile(files.cniDocument[0], 'agents/cni');
      agentData.cniDocument = result.secure_url;
    }

    if (dto.agentType === AgentType.COMPANY && files?.registrationDocument?.[0]) {
      const result = await this.cloudinaryService.uploadFile(files.registrationDocument[0], 'agents/registration');
      agentData.registrationDocument = result.secure_url;
    }

    await this.agentModel.create(agentData);
    await this.sendOtp(dto.email.toLowerCase(), OtpType.EMAIL_VERIFICATION, 'agent', dto.firstName);

    return {
      message: 'Registration successful! Please check your email for a verification code.',
      email: dto.email.toLowerCase(),
      requiresVerification: true,
    };
  }

  async registerUniversity(dto: RegisterUniversityDto, logo?: Express.Multer.File) {
    const exists = await this.universityModel.findOne({ email: dto.email.toLowerCase() });
    if (exists) throw new ConflictException('Email already in use');

    const hashed = await bcrypt.hash(dto.password, 10);
    const uniData: any = {
      ...dto,
      email: dto.email.toLowerCase(),
      password: hashed,
      status: AccountStatus.PENDING,
      emailVerified: false,
    };

    if (logo) {
      const result = await this.cloudinaryService.uploadFile(logo, 'universities/logos');
      uniData.logo = result.secure_url;
    }

    await this.universityModel.create(uniData);
    await this.sendOtp(dto.email.toLowerCase(), OtpType.EMAIL_VERIFICATION, 'university', dto.name);

    return {
      message: 'Registration successful! Please check your email for a verification code.',
      email: dto.email.toLowerCase(),
      requiresVerification: true,
    };
  }

  // ─────────────────────────── EMAIL VERIFICATION ───────────────────────────

  async verifyEmail(email: string, code: string, role: string) {
    const normalizedEmail = email.toLowerCase();
    const otp = await this.otpModel.findOne({
      email: normalizedEmail,
      type: OtpType.EMAIL_VERIFICATION,
      role,
      used: false,
    }).sort({ createdAt: -1 });

    if (!otp) throw new BadRequestException('No verification code found. Please request a new one.');
    if (otp.expiresAt < new Date()) throw new BadRequestException('Verification code has expired. Please request a new one.');
    if (otp.code !== code) throw new BadRequestException('Invalid verification code.');

    // Mark OTP used
    otp.used = true;
    await otp.save();

    // Mark email as verified
    const user = await this.findUserByEmailAndRole(normalizedEmail, role);
    if (!user) throw new NotFoundException('Account not found.');
    user.emailVerified = true;
    await user.save();

    // Students get logged in immediately; agents & universities wait for admin
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

    // Agent / University: email verified but still pending admin approval
    return {
      verified: true,
      pendingApproval: true,
      message: 'Email verified! Your account is now pending admin approval. You will be notified once approved.',
    };
  }

  async resendVerificationCode(email: string, role: string) {
    const normalizedEmail = email.toLowerCase();
    const user = await this.findUserByEmailAndRole(normalizedEmail, role);
    if (!user) throw new NotFoundException('Account not found for this email and role.');
    if (user.emailVerified) throw new BadRequestException('Email is already verified.');

    const name = user.firstName || user.name || normalizedEmail;
    await this.sendOtp(normalizedEmail, OtpType.EMAIL_VERIFICATION, role, name);

    return { message: 'A new verification code has been sent to your email.' };
  }

  // ─────────────────────────── FORGOT PASSWORD ───────────────────────────

  async forgotPassword(email: string, role: string) {
    const normalizedEmail = email.toLowerCase();
    const user = await this.findUserByEmailAndRole(normalizedEmail, role);

    // Always return success to prevent user enumeration
    if (!user) return { message: 'If an account exists with this email, a reset code has been sent.' };

    const name = (user as any).firstName || (user as any).name || normalizedEmail;
    await this.sendOtp(normalizedEmail, OtpType.PASSWORD_RESET, role, name, true);

    return { message: 'If an account exists with this email, a reset code has been sent.' };
  }

  async resetPassword(email: string, code: string, newPassword: string, role: string) {
    const normalizedEmail = email.toLowerCase();
    const otp = await this.otpModel.findOne({
      email: normalizedEmail,
      type: OtpType.PASSWORD_RESET,
      role,
      used: false,
    }).sort({ createdAt: -1 });

    if (!otp) throw new BadRequestException('No reset code found. Please request a new one.');
    if (otp.expiresAt < new Date()) throw new BadRequestException('Reset code has expired. Please request a new one.');
    if (otp.code !== code) throw new BadRequestException('Invalid reset code.');

    // Mark used
    otp.used = true;
    await otp.save();

    const hashed = await bcrypt.hash(newPassword, 10);
    const user = await this.findUserByEmailAndRole(normalizedEmail, role);
    if (!user) throw new NotFoundException('Account not found.');
    user.password = hashed;
    await user.save();

    return { message: 'Password reset successfully. You can now log in with your new password.' };
  }

  // ─────────────────────────── LOGIN ───────────────────────────

  async login(dto: LoginDto) {
    let user: any;
    const role = dto.role;

    if (role === 'student' || role === 'admin') {
      user = await this.userModel.findOne({ email: dto.email.toLowerCase() });
    } else if (role === 'agent') {
      user = await this.agentModel.findOne({ email: dto.email.toLowerCase() });
    } else if (role === 'university') {
      user = await this.universityModel.findOne({ email: dto.email.toLowerCase() });
    } else {
      throw new BadRequestException('Invalid role');
    }

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const passwordValid = await bcrypt.compare(dto.password, user.password);
    if (!passwordValid) throw new UnauthorizedException('Invalid credentials');

    // Must verify email before logging in
    if (!user.emailVerified) {
      throw new UnauthorizedException('Please verify your email before logging in. Check your inbox for the verification code.');
    }

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

  // ─────────────────────────── HELPERS ───────────────────────────

  private async sendOtp(
    email: string,
    type: OtpType,
    role: string,
    name: string,
    isReset = false,
  ): Promise<void> {
    // Invalidate previous unused codes of the same type
    await this.otpModel.updateMany(
      { email, type, role, used: false },
      { used: true },
    );

    const code = generateOtp();
    await this.otpModel.create({ email, code, type, role, expiresAt: otpExpiry() });

    if (isReset) {
      await this.mailService.sendPasswordResetCode(email, code, name);
    } else {
      await this.mailService.sendVerificationCode(email, code, name);
    }
  }

  private async findUserByEmailAndRole(email: string, role: string): Promise<any | null> {
    if (role === 'student' || role === 'admin') {
      return this.userModel.findOne({ email });
    } else if (role === 'agent') {
      return this.agentModel.findOne({ email });
    } else if (role === 'university') {
      return this.universityModel.findOne({ email });
    }
    return null;
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
