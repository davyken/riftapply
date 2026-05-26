import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserRole, AccountStatus } from '../../common/enums';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true })
  firstName: string;

  @Prop({ required: true, trim: true })
  lastName: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ trim: true })
  city: string;

  @Prop()
  avatar: string;

  @Prop({ enum: UserRole, default: UserRole.STUDENT })
  role: UserRole;

  @Prop({ enum: AccountStatus, default: AccountStatus.ACTIVE })
  status: AccountStatus;

  @Prop()
  desiredField: string;

  @Prop()
  desiredModule: string;

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

export const UserSchema = SchemaFactory.createForClass(User);

// Auto-delete unverified accounts when verificationExpiry is reached (~60s precision)
UserSchema.index({ verificationExpiry: 1 }, { expireAfterSeconds: 0 });
