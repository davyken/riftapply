import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { NotificationType, NotificationStatus } from '../../common/enums';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
  @Prop({ type: Types.ObjectId, required: true })
  recipientId: Types.ObjectId;

  @Prop({ required: true })
  recipientEmail: string;

  @Prop({ required: true })
  recipientType: string; // student | agent | university | admin

  @Prop({ enum: NotificationType, required: true })
  type: NotificationType;

  @Prop({ required: true })
  subject: string;

  @Prop({ required: true })
  body: string;

  @Prop({ enum: NotificationStatus, default: NotificationStatus.SENT })
  status: NotificationStatus;

  @Prop({ type: Types.ObjectId })
  applicationId: Types.ObjectId;

  @Prop({ default: false })
  isRead: boolean;

  @Prop()
  readAt: Date;

  @Prop()
  sentBy: string; // admin id
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
