export enum UserRole {
  STUDENT = 'student',
  AGENT = 'agent',
  UNIVERSITY = 'university',
  ADMIN = 'admin',
}

export enum AccountStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  REJECTED = 'rejected',
  BLOCKED = 'blocked',
}

export enum AgentType {
  PERSONAL = 'personal',
  COMPANY = 'company',
}

export enum ApplicationStatus {
  PENDING_REVIEW = 'pending_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  SENT_TO_UNIVERSITY = 'sent_to_university',
  AWAITING_UNIVERSITY_RESPONSE = 'awaiting_university_response',
  ACCEPTED_BY_UNIVERSITY = 'accepted_by_university',
  REFUSED_BY_UNIVERSITY = 'refused_by_university',
  INFO_REQUESTED = 'info_requested',
}

export enum NotificationType {
  EMAIL = 'email',
  SMS = 'sms',
  DASHBOARD = 'dashboard',
}

export enum NotificationStatus {
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  FAILED = 'failed',
}
