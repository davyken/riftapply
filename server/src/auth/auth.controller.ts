import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Res,
  UploadedFiles,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { RegisterStudentDto, RegisterAgentDto, RegisterUniversityDto, LoginDto } from './dto/register.dto';
import { multerOptions } from '../common/multer.config';

class VerifyEmailDto {
  @IsEmail() email: string;
  @IsString() @IsNotEmpty() code: string;
  @IsString() @IsNotEmpty() role: string;
}

class ResendCodeDto {
  @IsEmail() email: string;
  @IsString() @IsNotEmpty() role: string;
}

class ForgotPasswordDto {
  @IsEmail() email: string;
  @IsString() @IsNotEmpty() role: string;
}

class ResetPasswordDto {
  @IsEmail() email: string;
  @IsString() @IsNotEmpty() code: string;
  @IsString() @MinLength(6) newPassword: string;
  @IsString() @IsNotEmpty() role: string;
}

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    @InjectModel('User') private userModel: Model<any>,
  ) {}

  @Get('seed-admin')
  async seedAdmin() {
    const email = 'admin@uniadmit.com';
    const exists = await this.userModel.findOne({ email });
    if (exists) {
      return { message: 'Admin already exists' };
    }
    const hashed = await bcrypt.hash('Admin@2024', 10);
    await this.userModel.create({
      firstName: 'Super',
      lastName: 'Admin',
      email,
      password: hashed,
      phone: '+1-000-000-0000',
      role: 'admin',
      status: 'active',
      emailVerified: true,
    });
    return { message: 'Admin created successfully!' };
  }

  @Post('register/student')
  @UseInterceptors(FileInterceptor('avatar', multerOptions))
  registerStudent(
    @Body() dto: RegisterStudentDto,
    @UploadedFile() avatar?: Express.Multer.File,
  ) {
    return this.authService.registerStudent(dto, avatar);
  }

  @Post('register/agent')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'cniDocument', maxCount: 1 },
        { name: 'registrationDocument', maxCount: 1 },
        { name: 'avatar', maxCount: 1 },
      ],
      multerOptions,
    ),
  )
  registerAgent(
    @Body() dto: RegisterAgentDto,
    @UploadedFiles()
    files: {
      cniDocument?: Express.Multer.File[];
      registrationDocument?: Express.Multer.File[];
      avatar?: Express.Multer.File[];
    },
  ) {
    return this.authService.registerAgent(dto, files);
  }

  @Post('register/university')
  @UseInterceptors(FileInterceptor('logo', multerOptions))
  registerUniversity(
    @Body() dto: RegisterUniversityDto,
    @UploadedFile() logo: Express.Multer.File,
  ) {
    return this.authService.registerUniversity(dto, logo);
  }

  /** Verify email with OTP code */
  @Post('verify-email')
  verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.authService.verifyEmail(dto.email, dto.code, dto.role);
  }

  /** Resend a fresh verification code */
  @Post('resend-code')
  @Throttle({ auth: { ttl: 60000, limit: 3 } })
  resendVerificationCode(@Body() dto: ResendCodeDto) {
    return this.authService.resendVerificationCode(dto.email, dto.role);
  }

  /** Request a password-reset code */
  @Post('forgot-password')
  @Throttle({ auth: { ttl: 60000, limit: 5 } })
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email, dto.role);
  }

  /** Set a new password using the reset code */
  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.email, dto.code, dto.newPassword, dto.role);
  }

  @Get('avatar')
  async getAvatar(@Query('name') name: string, @Res() res: any) {
    const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || 'User')}`;
    return res.redirect(avatarUrl);
  }

  // Stricter rate limit on login: 10 attempts per minute (brute-force protection)
  @Post('login')
  @Throttle({ auth: { ttl: 60000, limit: 10 } })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
