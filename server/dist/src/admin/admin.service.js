"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../users/schemas/user.schema");
const agent_schema_1 = require("../agents/schemas/agent.schema");
const university_schema_1 = require("../universities/schemas/university.schema");
const application_schema_1 = require("../applications/schemas/application.schema");
const notification_schema_1 = require("../notifications/schemas/notification.schema");
const mail_service_1 = require("../mail/mail.service");
const enums_1 = require("../common/enums");
let AdminService = class AdminService {
    userModel;
    agentModel;
    universityModel;
    applicationModel;
    notificationModel;
    mailService;
    constructor(userModel, agentModel, universityModel, applicationModel, notificationModel, mailService) {
        this.userModel = userModel;
        this.agentModel = agentModel;
        this.universityModel = universityModel;
        this.applicationModel = applicationModel;
        this.notificationModel = notificationModel;
        this.mailService = mailService;
    }
    async getDashboardStats() {
        const [students, agents, universities, applications] = await Promise.all([
            this.userModel.countDocuments({ role: enums_1.UserRole.STUDENT }),
            this.agentModel.countDocuments(),
            this.universityModel.countDocuments(),
            this.applicationModel.countDocuments(),
        ]);
        const pendingAgents = await this.agentModel.countDocuments({ status: enums_1.AccountStatus.PENDING });
        const pendingUniversities = await this.universityModel.countDocuments({ status: enums_1.AccountStatus.PENDING });
        const pendingApplications = await this.applicationModel.countDocuments({ status: enums_1.ApplicationStatus.PENDING_REVIEW });
        const universityReplies = await this.applicationModel.countDocuments({
            status: { $in: [enums_1.ApplicationStatus.ACCEPTED_BY_UNIVERSITY, enums_1.ApplicationStatus.REFUSED_BY_UNIVERSITY] },
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
    getPendingAgents() {
        return this.agentModel.find({ status: enums_1.AccountStatus.PENDING }).select('-password').sort({ createdAt: -1 });
    }
    getPendingUniversities() {
        return this.universityModel.find({ status: enums_1.AccountStatus.PENDING }).select('-password').sort({ createdAt: -1 });
    }
    getAllAgents(status) {
        const filter = status ? { status: status } : {};
        return this.agentModel.find(filter).select('-password').sort({ createdAt: -1 });
    }
    getAllUniversities(status) {
        const filter = status ? { status: status } : {};
        return this.universityModel.find(filter).select('-password').sort({ createdAt: -1 });
    }
    getAllStudents() {
        return this.userModel
            .find({ role: enums_1.UserRole.STUDENT })
            .select('-password')
            .sort({ createdAt: -1 });
    }
    async broadcastEmail(dto) {
        const { subject, message, roles } = dto;
        const emails = [];
        const includeAll = !roles || roles.length === 0 || roles.includes('all');
        if (includeAll || roles.includes('student')) {
            const students = await this.userModel
                .find({ role: enums_1.UserRole.STUDENT, emailVerified: true })
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
        const uniqueEmails = [...new Set(emails)];
        let sent = 0;
        let failed = 0;
        const BATCH_SIZE = 50;
        for (let i = 0; i < uniqueEmails.length; i += BATCH_SIZE) {
            const batch = uniqueEmails.slice(i, i + BATCH_SIZE);
            const results = await Promise.allSettled(batch.map((email) => this.mailService.sendBroadcast(email, subject, message)));
            results.forEach((r) => (r.status === 'fulfilled' ? sent++ : failed++));
        }
        return { sent, failed, total: uniqueEmails.length };
    }
    async sendCustomBulkEmail(dto) {
        const { fromName, replyTo, recipients, subject, message } = dto;
        const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const uniqueEmails = [
            ...new Set(recipients
                .map((e) => e.trim().toLowerCase())
                .filter((e) => EMAIL_RE.test(e))),
        ];
        if (uniqueEmails.length === 0)
            throw new common_1.BadRequestException('No valid recipient emails provided');
        if (uniqueEmails.length > 600)
            throw new common_1.BadRequestException('Maximum 600 recipients per send');
        let sent = 0;
        let failed = 0;
        const BATCH_SIZE = 50;
        for (let i = 0; i < uniqueEmails.length; i += BATCH_SIZE) {
            const batch = uniqueEmails.slice(i, i + BATCH_SIZE);
            const results = await Promise.allSettled(batch.map((email) => this.mailService.sendCustomBulk(email, fromName, replyTo, subject, message)));
            results.forEach((r) => (r.status === 'fulfilled' ? sent++ : failed++));
        }
        return { sent, failed, total: uniqueEmails.length };
    }
    async deleteAgent(id) {
        const agent = await this.agentModel.findByIdAndDelete(id);
        if (!agent)
            throw new common_1.NotFoundException('Agent not found');
        return { deleted: true };
    }
    async deleteUniversity(id) {
        const uni = await this.universityModel.findByIdAndDelete(id);
        if (!uni)
            throw new common_1.NotFoundException('University not found');
        return { deleted: true };
    }
    async deleteStudent(id) {
        const student = await this.userModel.findOneAndDelete({ _id: id, role: enums_1.UserRole.STUDENT });
        if (!student)
            throw new common_1.NotFoundException('Student not found');
        return { deleted: true };
    }
    async approveAgent(agentId) {
        const agent = await this.agentModel.findByIdAndUpdate(agentId, { status: enums_1.AccountStatus.ACTIVE, isVerified: true, rejectionReason: null }, { new: true }).select('-password');
        if (!agent)
            throw new common_1.NotFoundException('Agent not found');
        return agent;
    }
    async rejectAgent(agentId, reason) {
        const agent = await this.agentModel.findByIdAndUpdate(agentId, { status: enums_1.AccountStatus.REJECTED, rejectionReason: reason }, { new: true }).select('-password');
        if (!agent)
            throw new common_1.NotFoundException('Agent not found');
        await this.notificationModel.create({
            recipientId: agent._id,
            recipientEmail: agent.email,
            recipientType: 'agent',
            type: enums_1.NotificationType.DASHBOARD,
            subject: 'Your account documents have been rejected',
            body: reason || 'Your submitted documents have been rejected. Please contact support for more information.',
            sentBy: 'admin',
        });
        return agent;
    }
    async approveUniversity(universityId) {
        const uni = await this.universityModel.findByIdAndUpdate(universityId, { status: enums_1.AccountStatus.ACTIVE, isVerified: true, rejectionReason: null }, { new: true }).select('-password');
        if (!uni)
            throw new common_1.NotFoundException('University not found');
        return uni;
    }
    async rejectUniversity(universityId, reason) {
        const uni = await this.universityModel.findByIdAndUpdate(universityId, { status: enums_1.AccountStatus.REJECTED, rejectionReason: reason }, { new: true }).select('-password');
        if (!uni)
            throw new common_1.NotFoundException('University not found');
        return uni;
    }
    getAllApplications(status) {
        const filter = status ? { status: status } : {};
        return this.applicationModel.find(filter).sort({ createdAt: -1 });
    }
    async getApplicationById(id) {
        const app = await this.applicationModel.findById(id);
        if (!app)
            throw new common_1.NotFoundException('Application not found');
        return app;
    }
    async approveApplication(id, adminId) {
        const app = await this.applicationModel.findById(id);
        if (!app)
            throw new common_1.NotFoundException('Application not found');
        app.status = enums_1.ApplicationStatus.APPROVED;
        app.approvedAt = new Date();
        app.auditLog.push({ action: 'Approved by admin', by: adminId, at: new Date(), note: '' });
        return app.save();
    }
    async rejectApplication(id, adminId, reason) {
        const app = await this.applicationModel.findById(id);
        if (!app)
            throw new common_1.NotFoundException('Application not found');
        app.status = enums_1.ApplicationStatus.REJECTED;
        app.rejectionReason = reason;
        app.auditLog.push({ action: 'Rejected by admin', by: adminId, at: new Date(), note: reason });
        await app.save();
        await this.notificationModel.create({
            recipientId: app.applicantId,
            recipientEmail: app.applicantEmail,
            recipientType: app.applicantType,
            type: enums_1.NotificationType.DASHBOARD,
            subject: `Your application to ${app.universityName} has been rejected`,
            body: reason || 'Your application documents have been rejected. Please contact support for more information.',
            applicationId: app._id,
            sentBy: adminId,
        });
        return app;
    }
    async sendToUniversity(id, adminId) {
        const app = await this.applicationModel.findById(id);
        if (!app)
            throw new common_1.NotFoundException('Application not found');
        app.status = enums_1.ApplicationStatus.SENT_TO_UNIVERSITY;
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
            }
            catch (_) { }
            await this.notificationModel.create({
                recipientId: app.universityId,
                recipientEmail: university.email,
                recipientType: 'university',
                type: enums_1.NotificationType.DASHBOARD,
                subject: `New application forwarded: ${app.applicantName}`,
                body: `A new application from ${app.applicantName} for ${app.programName} (${app.moduleName}) has been forwarded to your institution. Please log in to review and respond.`,
                applicationId: app._id,
                sentBy: String(adminId),
            });
        }
        return app;
    }
    async notifyCandidate(applicationId, adminId, options) {
        const app = await this.applicationModel.findById(applicationId);
        if (!app)
            throw new common_1.NotFoundException('Application not found');
        let subject = options.emailSubject;
        let body = options.emailBody;
        if (!subject || !body) {
            let tpl;
            if (app.status === enums_1.ApplicationStatus.ACCEPTED_BY_UNIVERSITY || app.universityDecision === 'accepted') {
                tpl = this.buildAcceptanceEmailTemplate(app.applicantName, app.universityName, app.programName);
            }
            else if (app.status === enums_1.ApplicationStatus.REFUSED_BY_UNIVERSITY || app.universityDecision === 'refused') {
                tpl = this.buildRejectionEmailTemplate(app.applicantName, app.universityName);
            }
            else {
                tpl = this.buildWaitingEmailTemplate(app.applicantName, app.universityName);
            }
            subject = subject || tpl.subject;
            body = body || tpl.body;
        }
        const notifications = [];
        if (options.sendEmail) {
            try {
                await this.mailService.sendMail({ to: app.applicantEmail, subject, html: body });
            }
            catch (_) { }
            await this.notificationModel.create({
                recipientId: app.applicantId,
                recipientEmail: app.applicantEmail,
                recipientType: app.applicantType,
                type: enums_1.NotificationType.EMAIL,
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
                type: enums_1.NotificationType.DASHBOARD,
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
    buildAcceptanceEmailTemplate(candidateName, universityName, program) {
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
    buildRejectionEmailTemplate(candidateName, universityName) {
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
    buildWaitingEmailTemplate(candidateName, universityName) {
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
    async migrateUniversityIds() {
        const result = await this.applicationModel.collection.updateMany({ universityId: { $type: 'string' } }, [{ $set: { universityId: { $toObjectId: '$universityId' } } }]);
        return { modifiedCount: result.modifiedCount, message: 'universityId fields converted from string to ObjectId' };
    }
    async getUniversityIdMap() {
        const universities = await this.universityModel.find({}).select('name email _id status');
        const sentApps = await this.applicationModel
            .find({ status: enums_1.ApplicationStatus.SENT_TO_UNIVERSITY })
            .select('universityId universityName applicantName status');
        return { universities, sentApps };
    }
    getUniversityReplies() {
        return this.applicationModel
            .find({
            status: { $in: [enums_1.ApplicationStatus.ACCEPTED_BY_UNIVERSITY, enums_1.ApplicationStatus.REFUSED_BY_UNIVERSITY, enums_1.ApplicationStatus.INFO_REQUESTED] },
        })
            .sort({ universityRespondedAt: -1 });
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(agent_schema_1.Agent.name)),
    __param(2, (0, mongoose_1.InjectModel)(university_schema_1.University.name)),
    __param(3, (0, mongoose_1.InjectModel)(application_schema_1.Application.name)),
    __param(4, (0, mongoose_1.InjectModel)(notification_schema_1.Notification.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mail_service_1.MailService])
], AdminService);
//# sourceMappingURL=admin.service.js.map