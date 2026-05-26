import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OtpDocument = Otp & Document;

export enum OtpType {
  EMAIL_VERIFICATION = 'email_verification',
  PASSWORD_RESET = 'password_reset',
}

@Schema({ timestamps: true })
export class Otp {
  @Prop({ required: true, lowercase: true })
  email: string;

  @Prop({ required: true })
  code: string;

  @Prop({ required: true, enum: OtpType })
  type: OtpType;

  /** The user type: student | agent | university | admin */
  @Prop({ required: true })
  role: string;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ default: false })
  used: boolean;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);

// Auto-expire documents 1 hour after creation (belt-and-suspenders cleanup)
OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
