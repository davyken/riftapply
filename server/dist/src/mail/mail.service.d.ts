import { ConfigService } from '@nestjs/config';
export declare class MailService {
    private config;
    private readonly logger;
    private resend;
    private fromEmail;
    constructor(config: ConfigService);
    sendVerificationCode(to: string, code: string, name: string): Promise<void>;
    sendMail(options: {
        to: string;
        subject: string;
        html: string;
    }): Promise<void>;
    sendBroadcast(to: string, subject: string, message: string): Promise<void>;
    sendCustomBulk(to: string, fromName: string, replyTo: string | undefined, subject: string, message: string): Promise<void>;
    sendPasswordResetCode(to: string, code: string, name: string): Promise<void>;
}
