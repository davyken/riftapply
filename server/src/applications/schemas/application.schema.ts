import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApplicationStatus } from '../../common/enums';

export type ApplicationDocument = Application & Document;

@Schema()
class Document_ {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  url: string; // Cloudinary URL

  @Prop({ required: true })
  publicId: string; // Cloudinary public_id
}

@Schema()
class AuditEntry {
  @Prop({ required: true })
  action: string;

  @Prop({ required: true })
  by: string; // admin id or name

  @Prop({ default: Date.now })
  at: Date;

  @Prop()
  note: string;
}

@Schema({ timestamps: true })
export class Application {
  // Applicant (student OR agent)
  @Prop({ type: Types.ObjectId, required: true })
  applicantId: Types.ObjectId;

  @Prop({ enum: ['student', 'agent'], required: true })
  applicantType: string;

  @Prop({ required: true })
  applicantName: string;

  @Prop({ required: true })
  applicantEmail: string;

  @Prop({ required: true })
  applicantPhone: string;

  // Target university
  @Prop({ type: Types.ObjectId, ref: 'University', required: true })
  universityId: Types.ObjectId;

  @Prop({ required: true })
  universityName: string;

  @Prop({ required: true })
  moduleName: string;

  @Prop({ required: true })
  programName: string;

  // Documents
  @Prop({ type: [Document_], default: [] })
  documents: Document_[];

  // Status tracking
  @Prop({ enum: ApplicationStatus, default: ApplicationStatus.PENDING_REVIEW })
  status: ApplicationStatus;

  @Prop()
  adminNote: string;

  @Prop()
  rejectionReason: string;

  // University response
  @Prop()
  universityResponse: string;

  @Prop()
  universityDecision: string; // accepted | refused | info_requested

  // Dates
  @Prop()
  approvedAt: Date;

  @Prop()
  sentToUniversityAt: Date;

  @Prop()
  universityRespondedAt: Date;

  @Prop()
  candidateNotifiedAt: Date;

  // Audit trail
  @Prop({ type: [AuditEntry], default: [] })
  auditLog: AuditEntry[];
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);
