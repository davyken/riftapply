import { ConfigService } from '@nestjs/config';
export interface SendMailOptions {
    to: string;
    subject: string;
    html: string;
}
export declare class MailService {
    private config;
    private readonly logger;
    private transporter;
    constructor(config: ConfigService);
    sendMail(options: SendMailOptions): Promise<void>;
}
