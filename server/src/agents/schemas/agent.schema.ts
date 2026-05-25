import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AccountStatus, AgentType } from '../../common/enums';

export type AgentDocument = Agent & Document;

@Schema({ timestamps: true })
export class Agent {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ enum: AgentType, required: true })
  agentType: AgentType;

  // Personal account fields
  @Prop()
  city: string;

  @Prop()
  avatar: string;

  @Prop()
  cniDocument: string; // Cloudinary URL

  // Company account fields
  @Prop()
  companyName: string;

  @Prop()
  companyLocation: string;

  @Prop()
  companyLogo: string; // Cloudinary URL

  @Prop()
  registrationDocument: string; // Cloudinary URL

  @Prop({ enum: AccountStatus, default: AccountStatus.PENDING })
  status: AccountStatus;

  @Prop()
  rejectionReason: string;

  @Prop({ default: false })
  isVerified: boolean;
}

export const AgentSchema = SchemaFactory.createForClass(Agent);
