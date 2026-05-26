import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private resend: Resend;
  private fromEmail: string;

  constructor(private config: ConfigService) {
    this.resend = new Resend(config.get<string>('RESEND_API_KEY'));
    this.fromEmail = config.get<string>('RESEND_FROM_EMAIL') || 'noreply@riftapply.com';
  }

  async sendVerificationCode(to: string, code: string, name: string): Promise<void> {
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
    } catch (error) {
      this.logger.error(`Failed to send verification code to ${to}`, error.message);
      throw error;
    }
  }

  /** Generic email sender used by other services (e.g. admin notifications) */
  async sendMail(options: { to: string; subject: string; html: string }): Promise<void> {
    try {
      await this.resend.emails.send({
        from: `riftApply <${this.fromEmail}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
      });
      this.logger.log(`Email sent to ${options.to}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${options.to}`, error.message);
      throw error;
    }
  }

  async sendPasswordResetCode(to: string, code: string, name: string): Promise<void> {
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
    } catch (error) {
      this.logger.error(`Failed to send password reset code to ${to}`, error.message);
      throw error;
    }
  }
}
