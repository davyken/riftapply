export type UserRole = 'student' | 'agent' | 'university' | 'admin';
export type AccountStatus = 'active' | 'pending' | 'rejected' | 'blocked';
export type AgentType = 'personal' | 'company';
export type ApplicationStatus =
  | 'pending_review'
  | 'approved'
  | 'rejected'
  | 'sent_to_university'
  | 'awaiting_university_response'
  | 'accepted_by_university'
  | 'refused_by_university'
  | 'info_requested';

export interface Student {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city?: string;
  avatar?: string;
  desiredField?: string;
  desiredModule?: string;
  role: 'student';
  status: AccountStatus;
  createdAt: string;
}

export interface Agent {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  agentType: AgentType;
  city?: string;
  avatar?: string;
  companyName?: string;
  companyLocation?: string;
  companyLogo?: string;
  status: AccountStatus;
  isVerified: boolean;
  rejectionReason?: string;
  createdAt: string;
}

export interface Program {
  name: string;
  duration: number;
  tuitionFee: number;
  currency: string;
  installments: number;
  availableSeats?: number;
  description?: string;
}

export interface UniversityModule {
  name: string;
  programs: Program[];
}

export interface University {
  _id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  district?: string;
  address?: string;
  logo?: string;
  website?: string;
  about?: string;
  modules: UniversityModule[];
  requirements?: string[];
  status: AccountStatus;
  isVerified: boolean;
  createdAt: string;
}

export interface ApplicationDocument {
  name: string;
  url: string;
  publicId: string;
}

export interface AuditEntry {
  action: string;
  by: string;
  at: string;
  note?: string;
}

export interface Application {
  _id: string;
  applicantId: string;
  applicantType: 'student' | 'agent';
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  universityId: string;
  universityName: string;
  moduleName: string;
  programName: string;
  documents: ApplicationDocument[];
  status: ApplicationStatus;
  adminNote?: string;
  rejectionReason?: string;
  universityResponse?: string;
  universityDecision?: string;
  approvedAt?: string;
  sentToUniversityAt?: string;
  universityRespondedAt?: string;
  candidateNotifiedAt?: string;
  auditLog: AuditEntry[];
  createdAt: string;
}

export interface Notification {
  _id: string;
  recipientId: string;
  recipientEmail: string;
  recipientType: string;
  type: 'email' | 'sms' | 'dashboard';
  subject: string;
  body: string;
  isRead: boolean;
  readAt?: string;
  applicationId?: string;
  createdAt: string;
}

export interface AdminStats {
  students: number;
  agents: { total: number; pending: number };
  universities: { total: number; pending: number };
  applications: { total: number; pendingReview: number };
  universityRepliesAwaitingAction: number;
}
