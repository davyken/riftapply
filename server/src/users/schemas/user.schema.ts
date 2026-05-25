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
}

export const UserSchema = SchemaFactory.createForClass(User);
