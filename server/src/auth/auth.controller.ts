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
import { RegisterStudentDto, RegisterAgentDto, RegisterUniversityDto, LoginDto } from './dto/register.dto';
import { multerOptions } from '../common/multer.config';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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
