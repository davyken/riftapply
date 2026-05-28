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
var MailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const resend_1 = require("resend");
let MailService = MailService_1 = class MailService {
    config;
    logger = new common_1.Logger(MailService_1.name);
    resend;
    fromEmail;
    constructor(config) {
        this.config = config;
        this.resend = new resend_1.Resend(config.get('RESEND_API_KEY'));
        this.fromEmail = config.get('RESEND_FROM_EMAIL') || 'noreply@riftapply.com';
    }
    async sendVerificationCode(to, code, name) {
        try {
            await this.resend.emails.send({
                from: `riftApply <${this.fromEmail}>`,
                to,
                subject: 'Verify your email – riftApply',
                html: `
          <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:520px;margin:0 auto;background:#fff;border-radius:12px;border:1px solid #e5e7eb;overflow:hidden;">
            <div style="background:linear-gradient(135deg,#0f2544 0%,#1a3a6b 100%);padding:32px 40px;">
              <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;letter-spacing:-0.3px;">riftApply</h1>
              <p style="margin:4px 0 0;color:#93c5fd;font-size:13px;">University Admissions Platform</p>
            </div>
            <div style="padding:36px 40px;">
              <h2 style="margin:0 0 8px;color:#111827;font-size:20px;font-weight:700;">Verify your email address</h2>
              <p style="margin:0 0 24px;color:#6b7280;font-size:14px;line-height:1.6;">Hi ${name}, welcome to riftApply! Use the code below to verify your email and complete your registration.</p>
              <div style="background:#f3f4f6;border-radius:10px;padding:20px 0;text-align:center;margin-bottom:24px;">
                <span style="font-size:36px;font-weight:800;letter-spacing:10px;color:#1a3a6b;font-family:monospace;">${code}</span>
              </div>
              <p style="margin:0 0 8px;color:#6b7280;font-size:13px;line-height:1.6;">This code expires in <strong>5 minutes</strong>. Do not share it with anyone.</p>
              <p style="margin:0;color:#9ca3af;font-size:12px;">If you did not create an account on riftApply, please ignore this email.</p>
            </div>
            <div style="background:#f9fafb;padding:16px 40px;border-top:1px solid #e5e7eb;">
              <p style="margin:0;color:#9ca3af;font-size:11px;text-align:center;">© ${new Date().getFullYear()} riftApply · All rights reserved</p>
            </div>
          </div>
        `,
            });
            this.logger.log(`Verification code sent to ${to}`);
        }
        catch (error) {
            this.logger.error(`Failed to send verification code to ${to}`, error.message);
            throw error;
        }
    }
    async sendMail(options) {
        try {
            await this.resend.emails.send({
                from: `riftApply <${this.fromEmail}>`,
                to: options.to,
                subject: options.subject,
                html: options.html,
            });
            this.logger.log(`Email sent to ${options.to}`);
        }
        catch (error) {
            this.logger.error(`Failed to send email to ${options.to}`, error.message);
            throw error;
        }
    }
    async sendBroadcast(to, subject, message) {
        const safeMessage = message.replace(/\n/g, '<br>');
        await this.resend.emails.send({
            from: `riftApply <${this.fromEmail}>`,
            to,
            subject,
            html: `
        <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:520px;margin:0 auto;background:#fff;border-radius:12px;border:1px solid #e5e7eb;overflow:hidden;">
          <div style="background:linear-gradient(135deg,#0f2544 0%,#1a3a6b 100%);padding:32px 40px;">
            <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;letter-spacing:-0.3px;">riftApply</h1>
            <p style="margin:4px 0 0;color:#93c5fd;font-size:13px;">University Admissions Platform</p>
          </div>
          <div style="padding:36px 40px;">
            <h2 style="margin:0 0 16px;color:#111827;font-size:18px;font-weight:700;">${subject}</h2>
            <div style="color:#374151;font-size:14px;line-height:1.7;">${safeMessage}</div>
          </div>
          <div style="background:#f9fafb;padding:16px 40px;border-top:1px solid #e5e7eb;">
            <p style="margin:0;color:#9ca3af;font-size:11px;text-align:center;">© ${new Date().getFullYear()} riftApply · All rights reserved · <a href="https://riftapply.com" style="color:#9ca3af;">riftapply.com</a></p>
          </div>
        </div>
      `,
        });
    }
    async sendCustomBulk(to, fromName, replyTo, subject, message) {
        const safeMessage = message.replace(/\n/g, '<br>');
        await this.resend.emails.send({
            from: `${fromName} <${this.fromEmail}>`,
            to,
            ...(replyTo ? { replyTo } : {}),
            subject,
            html: `
        <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:520px;margin:0 auto;background:#fff;border-radius:12px;border:1px solid #e5e7eb;overflow:hidden;">
          <div style="background:linear-gradient(135deg,#0f2544 0%,#1a3a6b 100%);padding:32px 40px;">
            <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;letter-spacing:-0.3px;">riftApply</h1>
            <p style="margin:4px 0 0;color:#93c5fd;font-size:13px;">University Admissions Platform</p>
          </div>
          <div style="padding:36px 40px;">
            <h2 style="margin:0 0 16px;color:#111827;font-size:18px;font-weight:700;">${subject}</h2>
            <div style="color:#374151;font-size:14px;line-height:1.7;">${safeMessage}</div>
          </div>
          <div style="background:#f9fafb;padding:16px 40px;border-top:1px solid #e5e7eb;">
            <p style="margin:0;color:#9ca3af;font-size:11px;text-align:center;">© ${new Date().getFullYear()} GreatRift Consultancy · Yaoundé, Cameroon · <a href="https://riftapply.com" style="color:#9ca3af;">riftapply.com</a></p>
          </div>
        </div>
      `,
        });
    }
    async sendPasswordResetCode(to, code, name) {
        try {
            await this.resend.emails.send({
                from: `riftApply <${this.fromEmail}>`,
                to,
                subject: 'Reset your password – riftApply',
                html: `
          <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:520px;margin:0 auto;background:#fff;border-radius:12px;border:1px solid #e5e7eb;overflow:hidden;">
            <div style="background:linear-gradient(135deg,#0f2544 0%,#1a3a6b 100%);padding:32px 40px;">
              <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;letter-spacing:-0.3px;">riftApply</h1>
              <p style="margin:4px 0 0;color:#93c5fd;font-size:13px;">University Admissions Platform</p>
            </div>
            <div style="padding:36px 40px;">
              <h2 style="margin:0 0 8px;color:#111827;font-size:20px;font-weight:700;">Reset your password</h2>
              <p style="margin:0 0 24px;color:#6b7280;font-size:14px;line-height:1.6;">Hi ${name}, we received a request to reset your riftApply password. Use the code below to set a new password.</p>
              <div style="background:#fef3c7;border-radius:10px;padding:20px 0;text-align:center;margin-bottom:24px;border:1px solid #fde68a;">
                <span style="font-size:36px;font-weight:800;letter-spacing:10px;color:#92400e;font-family:monospace;">${code}</span>
              </div>
              <p style="margin:0 0 8px;color:#6b7280;font-size:13px;line-height:1.6;">This code expires in <strong>10 minutes</strong>. Do not share it with anyone.</p>
              <p style="margin:0;color:#9ca3af;font-size:12px;">If you did not request a password reset, please ignore this email. Your account remains secure.</p>
            </div>
            <div style="background:#f9fafb;padding:16px 40px;border-top:1px solid #e5e7eb;">
              <p style="margin:0;color:#9ca3af;font-size:11px;text-align:center;">© ${new Date().getFullYear()} riftApply · All rights reserved</p>
            </div>
          </div>
        `,
            });
            this.logger.log(`Password reset code sent to ${to}`);
        }
        catch (error) {
            this.logger.error(`Failed to send password reset code to ${to}`, error.message);
            throw error;
        }
    }
};
exports.MailService = MailService;
exports.MailService = MailService = MailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MailService);
//# sourceMappingURL=mail.service.js.map