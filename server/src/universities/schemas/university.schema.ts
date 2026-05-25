import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AccountStatus } from '../../common/enums';

export type UniversityDocument = University & Document;

@Schema()
class Program {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  duration: number; // value

  @Prop({ default: 'years' })
  durationUnit: string; // 'years' or 'months'

  @Prop({ required: true })
  tuitionFee: number;

  @Prop()
  currency: string;

  @Prop({ default: 1 })
  installments: number; // number of payment instalments (1 = full payment upfront)

  @Prop()
  availableSeats: number;

  @Prop()
  description: string;
}

@Schema()
class Module {
  @Prop({ required: true })
  name: string;

  @Prop({ type: [Program], default: [] })
  programs: Program[];
}

@Schema({ timestamps: true })
export class University {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  city: string;

  @Prop()
  district: string;

  @Prop()
  address: string;

  @Prop()
  logo: string; // Cloudinary URL

  @Prop()
  website: string;

  @Prop()
  about: string;

  @Prop({ type: [Module], default: [] })
  modules: Module[];

  @Prop({ type: [String], default: ['Passport / National ID', 'English Proficiency Certificate', 'University Transcripts', 'Statement of Purpose'] })
  requirements: string[];

  @Prop({ enum: AccountStatus, default: AccountStatus.PENDING })
  status: AccountStatus;

  @Prop()
  rejectionReason: string;

  @Prop({ default: false })
  isVerified: boolean;
}

export const UniversitySchema = SchemaFactory.createForClass(University);
