import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Agent, AgentDocument } from '../agents/schemas/agent.schema';
import { University, UniversityDocument } from '../universities/schemas/university.schema';
import { Application, ApplicationDocument } from '../applications/schemas/application.schema';
import { Notification, NotificationDocument } from '../notifications/schemas/notification.schema';
import { MailService } from '../mail/mail.service';
import { AccountStatus, ApplicationStatus, NotificationType, UserRole } from '../common/enums';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Agent.name) private agentModel: Model<AgentDocument>,
    @InjectModel(University.name) private universityModel: Model<UniversityDocument>,
    @InjectModel(Application.name) private applicationModel: Model<ApplicationDocument>,
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
    private mailService: MailService,
  ) {}

  // ─── Dashboard Stats ──────────────────────────────────────────────
  async getDashboardStats() {
    const [students, agents, universities, applications] = await Promise.all([
      this.userModel.countDocuments({ role: UserRole.STUDENT }),
      this.agentModel.countDocuments(),
      this.universityModel.countDocuments(),
      this.applicationModel.countDocuments(),
    ]);

    const pendingAgents = await this.agentModel.countDocuments({ status: AccountStatus.PENDING });
    const pendingUniversities = await this.universityModel.countDocuments({ status: AccountStatus.PENDING });
    const pendingApplications = await this.applicationModel.countDocuments({ status: ApplicationStatus.PENDING_REVIEW });
    const universityReplies = await this.applicationModel.countDocuments({
      status: { $in: [ApplicationStatus.ACCEPTED_BY_UNIVERSITY, ApplicationStatus.REFUSED_BY_UNIVERSITY] },
      candidateNotifiedAt: null,
    });

    return {
      students,
      agents: { total: agents, pending: pendingAgents },
      universities: { total: universities, pending: pendingUniversities },
      applications: { total: applications, pendingReview: pendingApplications },
      universityRepliesAwaitingAction: universityReplies,
    };
  }

  // ─── Account Verification ─────────────────────────────────────────
  getPendingAgents() {
    return this.agentModel.find({ status: AccountStatus.PENDING }).select('-password').sort({ createdAt: -1 });
  }

  getPendingUniversities() {
    return this.universityModel.find({ status: AccountStatus.PENDING }).select('-password').sort({ createdAt: -1 });
  }

  getAllAgents(status?: string) {
    const filter = status ? { status: status as AccountStatus } : {};
    return this.agentModel.find(filter).select('-password').sort({ createdAt: -1 });
  }

  getAllUniversities(status?: string) {
    const filter = status ? { status: status as AccountStatus } : {};
    return this.universityModel.find(filter).select('-password').sort({ createdAt: -1 });
  }

  getAllStudents() {
    return this.userModel
      .find({ role: UserRole.STUDENT })
      .select('-password')
      .sort({ createdAt: -1 });
  }

  // ─── Broadcast Email ──────────────────────────────────────────────
  async broadcastEmail(dto: { subject: string; message: string; roles?: string[] }) {
    const { subject, message, roles } = dto;

    // Collect emails from all requested collections (only verified users)
    const emails: string[] = [];

    const includeAll = !roles || roles.length === 0 || roles.includes('all');

    if (includeAll || roles.includes('student')) {
      const students = await this.userModel
        .find({ role: UserRole.STUDENT, emailVerified: true })
        .select('email');
      emails.push(...students.map((u) => u.email));
    }

    if (includeAll || roles.includes('agent')) {
      const agents = await this.agentModel
        .find({ emailVerified: true })
        .select('email');
      emails.push(...agents.map((a) => a.email));
    }

    if (includeAll || roles.includes('university')) {
      const unis = await this.universityModel
        .find({ emailVerified: true })
        .select('email');
      emails.push(...unis.map((u) => u.email));
    }

    // Deduplicate
    const uniqueEmails = [...new Set(emails)];

    let sent = 0;
    let failed = 0;

    // Send in batches of 50 to respect rate limits
    const BATCH_SIZE = 50;
    for (let i = 0; i < uniqueEmails.length; i += BATCH_SIZE) {
      const batch = uniqueEmails.slice(i, i + BATCH_SIZE);
      const results = await Promise.allSettled(
        batch.map((email) => this.mailService.sendBroadcast(email, subject, message)),
      );
      results.forEach((r) => (r.status === 'fulfilled' ? sent++ : failed++));
    }

    return { sent, failed, total: uniqueEmails.length };
  }

  async deleteAgent(id: string) {
    const agent = await this.agentModel.findByIdAndDelete(id);
    if (!agent) throw new NotFoundException('Agent not found');
    return { deleted: true };
  }

  async deleteUniversity(id: string) {
    const uni = await this.universityModel.findByIdAndDelete(id);
    if (!uni) throw new NotFoundException('University not found');
    return { deleted: true };
  }

  async deleteStudent(id: string) {
    const student = await this.userModel.findOneAndDelete({ _id: id, role: UserRole.STUDENT });
    if (!student) throw new NotFoundException('Student not found');
    return { deleted: true };
  }

  async approveAgent(agentId: string) {
    const agent = await this.agentModel.findByIdAndUpdate(
      agentId,
      { status: AccountStatus.ACTIVE, isVerified: true, rejectionReason: null },
      { new: true },
    ).select('-password');
    if (!agent) throw new NotFoundException('Agent not found');
    return agent;
  }

  async rejectAgent(agentId: string, reason: string) {
    const agent = await this.agentModel.findByIdAndUpdate(
      agentId,
      { status: AccountStatus.REJECTED, rejectionReason: reason },
      { new: true },
    ).select('-password');
    if (!agent) throw new NotFoundException('Agent not found');

    await this.notificationModel.create({
      recipientId: agent._id,
      recipientEmail: agent.email,
      recipientType: 'agent',
      type: NotificationType.DASHBOARD,
      subject: 'Your account documents have been rejected',
      body: reason || 'Your submitted documents have been rejected. Please contact support for more information.',
      sentBy: 'admin',
    });

    return agent;
  }

  async approveUniversity(universityId: string) {
    const uni = await this.universityModel.findByIdAndUpdate(
      universityId,
      { status: AccountStatus.ACTIVE, isVerified: true, rejectionReason: null },
      { new: true },
    ).select('-password');
    if (!uni) throw new NotFoundException('University not found');
    return uni;
  }

  async rejectUniversity(universityId: string, reason: string) {
    const uni = await this.universityModel.findByIdAndUpdate(
      universityId,
      { status: AccountStatus.REJECTED, rejectionReason: reason },
      { new: true },
    ).select('-password');
    if (!uni) throw new NotFoundException('University not found');
    return uni;
  }

  // ─── Applications ─────────────────────────────────────────────────
  getAllApplications(status?: string) {
    const filter = status ? { status: status as ApplicationStatus } : {};
    return this.applicationModel.find(filter).sort({ createdAt: -1 });
  }

  async getApplicationById(id: string) {
    const app = await this.applicationModel.findById(id);
    if (!app) throw new NotFoundException('Application not found');
    return app;
  }

  async approveApplication(id: string, adminId: string) {
    const app = await this.applicationModel.findById(id);
    if (!app) throw new NotFoundException('Application not found');

    app.status = ApplicationStatus.APPROVED;
    app.approvedAt = new Date();
    app.auditLog.push({ action: 'Approved by admin', by: adminId, at: new Date(), note: '' });
    return app.save();
  }

  async rejectApplication(id: string, adminId: string, reason: string) {
    const app = await this.applicationModel.findById(id);
    if (!app) throw new NotFoundException('Application not found');

    app.status = ApplicationStatus.REJECTED;
    app.rejectionReason = reason;
    app.auditLog.push({ action: 'Rejected by admin', by: adminId, at: new Date(), note: reason });
    await app.save();

    await this.notificationModel.create({
      recipientId: app.applicantId,
      recipientEmail: app.applicantEmail,
      recipientType: app.applicantType,
      type: NotificationType.DASHBOARD,
      subject: `Your application to ${app.universityName} has been rejected`,
      body: reason || 'Your application documents have been rejected. Please contact support for more information.',
      applicationId: app._id,
      sentBy: adminId,
    });

    return app;
  }

  async sendToUniversity(id: string, adminId: string) {
    const app = await this.applicationModel.findById(id);
    if (!app) throw new NotFoundException('Application not found');

    app.status = ApplicationStatus.SENT_TO_UNIVERSITY;
    app.sentToUniversityAt = new Date();
    app.auditLog.push({ action: 'Sent to university', by: adminId, at: new Date(), note: '' });
    await app.save();

    console.log('[sendToUniversity] app.universityId:', String(app.universityId), 'type:', typeof app.universityId);

    const university = await this.universityModel.findById(app.universityId);
    if (university) {
      const emailHtml = `
        <h2>New Application Received</h2>
        <p>A student application has been forwarded to your institution for review.</p>
        <table style="border-collapse:collapse;width:100%;margin:12px 0">
          <tr><td style="padding:6px 10px;font-weight:600">Applicant</td><td style="padding:6px 10px">${app.applicantName}</td></tr>
          <tr style="background:#f9fafb"><td style="padding:6px 10px;font-weight:600">Email</td><td style="padding:6px 10px">${app.applicantEmail}</td></tr>
          <tr><td style="padding:6px 10px;font-weight:600">Module</td><td style="padding:6px 10px">${app.moduleName}</td></tr>
          <tr style="background:#f9fafb"><td style="padding:6px 10px;font-weight:600">Program</td><td style="padding:6px 10px">${app.programName}</td></tr>
        </table>
        <p>Please log in to your dashboard to review and respond to this application.</p>
        <p>Best regards,<br/>The UniAdmit Admissions Team</p>
      `;
      try {
        await this.mailService.sendMail({
          to: university.email,
          subject: `New Application: ${app.applicantName} — ${app.programName}`,
          html: emailHtml,
        });
      } catch (_) { /* non-blocking */ }

      await this.notificationModel.create({
        recipientId: app.universityId,
        recipientEmail: university.email,
        recipientType: 'university',
        type: NotificationType.DASHBOARD,
        subject: `New application forwarded: ${app.applicantName}`,
        body: `A new application from ${app.applicantName} for ${app.programName} (${app.moduleName}) has been forwarded to your institution. Please log in to review and respond.`,
        applicationId: app._id,
        sentBy: String(adminId),
      });
    }

    return app;
  }

  // ─── Notify Candidate ─────────────────────────────────────────────
  async notifyCandidate(
    applicationId: string,
    adminId: string,
    options: {
      sendEmail: boolean;
      emailSubject?: string;
      emailBody?: string;
      sendDashboard?: boolean;
    },
  ) {
    const app = await this.applicationModel.findById(applicationId);
    if (!app) throw new NotFoundException('Application not found');

    // Auto-generate template from university decision when no subject/body provided
    let subject = options.emailSubject;
    let body = options.emailBody;
    if (!subject || !body) {
      let tpl: { subject: string; body: string };
      if (app.status === ApplicationStatus.ACCEPTED_BY_UNIVERSITY || app.universityDecision === 'accepted') {
        tpl = this.buildAcceptanceEmailTemplate(app.applicantName, app.universityName, app.programName);
      } else if (app.status === ApplicationStatus.REFUSED_BY_UNIVERSITY || app.universityDecision === 'refused') {
        tpl = this.buildRejectionEmailTemplate(app.applicantName, app.universityName);
      } else {
        tpl = this.buildWaitingEmailTemplate(app.applicantName, app.universityName);
      }
      subject = subject || tpl.subject;
      body = body || tpl.body;
    }

    const notifications: any[] = [];

    if (options.sendEmail) {
      try {
        await this.mailService.sendMail({ to: app.applicantEmail, subject, html: body });
      } catch (_) { /* non-blocking */ }

      await this.notificationModel.create({
        recipientId: app.applicantId,
        recipientEmail: app.applicantEmail,
        recipientType: app.applicantType,
        type: NotificationType.EMAIL,
        subject,
        body,
        applicationId: app._id,
        sentBy: adminId,
      });
      notifications.push('email');
    }

    if (options.sendDashboard) {
      await this.notificationModel.create({
        recipientId: app.applicantId,
        recipientEmail: app.applicantEmail,
        recipientType: app.applicantType,
        type: NotificationType.DASHBOARD,
        subject,
        body,
        applicationId: app._id,
        sentBy: adminId,
      });
      notifications.push('dashboard');
    }

    app.candidateNotifiedAt = new Date();
    app.auditLog.push({
      action: `Candidate notified via: ${notifications.join(', ')}`,
      by: adminId,
      at: new Date(),
      note: subject,
    });
    await app.save();

    return { message: 'Candidate notified', channels: notifications };
  }

  // ─── Email Templates ──────────────────────────────────────────────
  buildAcceptanceEmailTemplate(candidateName: string, universityName: string, program: string) {
    return {
      subject: `Your application to ${universityName} has been accepted`,
      body: `
        <h2>Congratulations, ${candidateName}!</h2>
        <p>We are pleased to inform you that <strong>${universityName}</strong> has <strong>accepted</strong> your application for the <strong>${program}</strong> program.</p>
        <p>Please contact the university directly for next steps regarding enrollment.</p>
        <br/>
        <p>Best regards,</p>
        <p>The Admissions Team</p>
      `,
    };
  }

  buildRejectionEmailTemplate(candidateName: string, universityName: string) {
    return {
      subject: `Update on your application to ${universityName}`,
      body: `
        <h2>Dear ${candidateName},</h2>
        <p>We regret to inform you that after careful review, <strong>${universityName}</strong> was unable to offer you admission at this time.</p>
        <p>We encourage you to consider other programs or universities available on our platform.</p>
        <br/>
        <p>Best regards,</p>
        <p>The Admissions Team</p>
      `,
    };
  }

  buildWaitingEmailTemplate(candidateName: string, universityName: string) {
    return {
      subject: `Your application has been submitted to ${universityName}`,
      body: `
        <h2>Dear ${candidateName},</h2>
        <p>Your application to <strong>${universityName}</strong> has been successfully submitted and is now under review.</p>
        <p>The review process typically takes <strong>48 hours to 1 week</strong>. We will notify you as soon as we receive a response.</p>
        <br/>
        <p>Thank you for your patience.</p>
        <p>The Admissions Team</p>
      `,
    };
  }

  // ─── Migrations ──────────────────────────────────────────────────
  async migrateUniversityIds() {
    const result = await this.applicationModel.collection.updateMany(
      { universityId: { $type: 'string' } },
      [{ $set: { universityId: { $toObjectId: '$universityId' } } }],
    );
    return { modifiedCount: result.modifiedCount, message: 'universityId fields converted from string to ObjectId' };
  }

  // ─── Debug ───────────────────────────────────────────────────────
  async getUniversityIdMap() {
    const universities = await this.universityModel.find({}).select('name email _id status');
    const sentApps = await this.applicationModel
      .find({ status: ApplicationStatus.SENT_TO_UNIVERSITY })
      .select('universityId universityName applicantName status');
    return { universities, sentApps };
  }

  // ─── Notifications Inbox ─────────────────────────────────────────
  getUniversityReplies() {
    return this.applicationModel
      .find({
        status: { $in: [ApplicationStatus.ACCEPTED_BY_UNIVERSITY, ApplicationStatus.REFUSED_BY_UNIVERSITY, ApplicationStatus.INFO_REQUESTED] },
      })
      .sort({ universityRespondedAt: -1 });
  }
}
