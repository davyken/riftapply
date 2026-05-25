import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { AgentType } from '../../common/enums';

export class RegisterStudentDto {
  @IsString() @IsNotEmpty() firstName: string;
  @IsString() @IsNotEmpty() lastName: string;
  @IsEmail() email: string;
  @IsString() @MinLength(6) password: string;
  @IsString() @IsNotEmpty() phone: string;
  @IsString() @IsOptional() city?: string;
  @IsString() @IsOptional() desiredField?: string;
  @IsString() @IsOptional() desiredModule?: string;
}

export class RegisterAgentDto {
  @IsString() @IsNotEmpty() firstName: string;
  @IsString() @IsNotEmpty() lastName: string;
  @IsEmail() email: string;
  @IsString() @MinLength(6) password: string;
  @IsString() @IsNotEmpty() phone: string;
  @IsEnum(AgentType) agentType: AgentType;

  // Personal only
  @IsString() @IsOptional() city?: string;

  // Company only
  @IsString() @IsOptional() companyName?: string;
  @IsString() @IsOptional() companyLocation?: string;
}

export class RegisterUniversityDto {
  @IsString() @IsNotEmpty() name: string;
  @IsEmail() email: string;
  @IsString() @MinLength(6) password: string;
  @IsString() @IsNotEmpty() phone: string;
  @IsString() @IsNotEmpty() city: string;
  @IsString() @IsOptional() district?: string;
  @IsString() @IsOptional() address?: string;
  @IsString() @IsOptional() website?: string;
}

export class LoginDto {
  @IsEmail() email: string;
  @IsString() @IsNotEmpty() password: string;
  @IsString() @IsNotEmpty() role: string;
}
