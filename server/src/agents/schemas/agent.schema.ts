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

  @Prop({ default: false })
  emailVerified: boolean;

  /**
   * Set to `now + 5 minutes` on registration.
   * MongoDB TTL index auto-deletes the document when this date is reached
   * (only while emailVerified is false — we $unset this field on verification).
   */
  @Prop()
  verificationExpiry: Date;
}

export const AgentSchema = SchemaFactory.createForClass(Agent);

// Auto-delete unverified accounts when verificationExpiry is reached (~60s precision)
AgentSchema.index({ verificationExpiry: 1 }, { expireAfterSeconds: 0 });
