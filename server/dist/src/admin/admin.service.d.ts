import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Agent, AgentDocument } from '../agents/schemas/agent.schema';
import { University, UniversityDocument } from '../universities/schemas/university.schema';
import { Application, ApplicationDocument } from '../applications/schemas/application.schema';
import { NotificationDocument } from '../notifications/schemas/notification.schema';
import { MailService } from '../mail/mail.service';
export declare class AdminService {
    private userModel;
    private agentModel;
    private universityModel;
    private applicationModel;
    private notificationModel;
    private mailService;
    constructor(userModel: Model<UserDocument>, agentModel: Model<AgentDocument>, universityModel: Model<UniversityDocument>, applicationModel: Model<ApplicationDocument>, notificationModel: Model<NotificationDocument>, mailService: MailService);
    getDashboardStats(): Promise<{
        students: number;
        agents: {
            total: number;
            pending: number;
        };
        universities: {
            total: number;
            pending: number;
        };
        applications: {
            total: number;
            pendingReview: number;
        };
        universityRepliesAwaitingAction: number;
    }>;
    getPendingAgents(): import("mongoose").Query<(import("mongoose").Document<unknown, {}, AgentDocument, {}, import("mongoose").DefaultSchemaOptions> & Agent & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[], import("mongoose").Document<unknown, {}, AgentDocument, {}, import("mongoose").DefaultSchemaOptions> & Agent & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, {}, AgentDocument, "find", {}>;
    getPendingUniversities(): import("mongoose").Query<(import("mongoose").Document<unknown, {}, UniversityDocument, {}, import("mongoose").DefaultSchemaOptions> & University & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[], import("mongoose").Document<unknown, {}, UniversityDocument, {}, import("mongoose").DefaultSchemaOptions> & University & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, {}, UniversityDocument, "find", {}>;
    getAllAgents(status?: string): import("mongoose").Query<(import("mongoose").Document<unknown, {}, AgentDocument, {}, import("mongoose").DefaultSchemaOptions> & Agent & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[], import("mongoose").Document<unknown, {}, AgentDocument, {}, import("mongoose").DefaultSchemaOptions> & Agent & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, {}, AgentDocument, "find", {}>;
    getAllUniversities(status?: string): import("mongoose").Query<(import("mongoose").Document<unknown, {}, UniversityDocument, {}, import("mongoose").DefaultSchemaOptions> & University & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[], import("mongoose").Document<unknown, {}, UniversityDocument, {}, import("mongoose").DefaultSchemaOptions> & University & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, {}, UniversityDocument, "find", {}>;
    getAllStudents(): import("mongoose").Query<(import("mongoose").Document<unknown, {}, UserDocument, {}, import("mongoose").DefaultSchemaOptions> & User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[], import("mongoose").Document<unknown, {}, UserDocument, {}, import("mongoose").DefaultSchemaOptions> & User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, {}, UserDocument, "find", {}>;
    broadcastEmail(dto: {
        subject: string;
        message: string;
        roles?: string[];
    }): Promise<{
        sent: number;
        failed: number;
        total: number;
    }>;
    sendCustomBulkEmail(dto: {
        fromName: string;
        replyTo?: string;
        recipients: string[];
        subject: string;
        message: string;
    }): Promise<{
        sent: number;
        failed: number;
        total: number;
    }>;
    deleteAgent(id: string): Promise<{
        deleted: boolean;
    }>;
    deleteUniversity(id: string): Promise<{
        deleted: boolean;
    }>;
    deleteStudent(id: string): Promise<{
        deleted: boolean;
    }>;
    approveAgent(agentId: string): Promise<import("mongoose").Document<unknown, {}, AgentDocument, {}, import("mongoose").DefaultSchemaOptions> & Agent & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    rejectAgent(agentId: string, reason: string): Promise<import("mongoose").Document<unknown, {}, AgentDocument, {}, import("mongoose").DefaultSchemaOptions> & Agent & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    approveUniversity(universityId: string): Promise<import("mongoose").Document<unknown, {}, UniversityDocument, {}, import("mongoose").DefaultSchemaOptions> & University & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    rejectUniversity(universityId: string, reason: string): Promise<import("mongoose").Document<unknown, {}, UniversityDocument, {}, import("mongoose").DefaultSchemaOptions> & University & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    getAllApplications(status?: string): import("mongoose").Query<(import("mongoose").Document<unknown, {}, ApplicationDocument, {}, import("mongoose").DefaultSchemaOptions> & Application & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[], import("mongoose").Document<unknown, {}, ApplicationDocument, {}, import("mongoose").DefaultSchemaOptions> & Application & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, {}, ApplicationDocument, "find", {}>;
    getApplicationById(id: string): Promise<import("mongoose").Document<unknown, {}, ApplicationDocument, {}, import("mongoose").DefaultSchemaOptions> & Application & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    approveApplication(id: string, adminId: string): Promise<import("mongoose").Document<unknown, {}, ApplicationDocument, {}, import("mongoose").DefaultSchemaOptions> & Application & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    rejectApplication(id: string, adminId: string, reason: string): Promise<import("mongoose").Document<unknown, {}, ApplicationDocument, {}, import("mongoose").DefaultSchemaOptions> & Application & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    sendToUniversity(id: string, adminId: string): Promise<import("mongoose").Document<unknown, {}, ApplicationDocument, {}, import("mongoose").DefaultSchemaOptions> & Application & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    notifyCandidate(applicationId: string, adminId: string, options: {
        sendEmail: boolean;
        emailSubject?: string;
        emailBody?: string;
        sendDashboard?: boolean;
    }): Promise<{
        message: string;
        channels: any[];
    }>;
    buildAcceptanceEmailTemplate(candidateName: string, universityName: string, program: string): {
        subject: string;
        body: string;
    };
    buildRejectionEmailTemplate(candidateName: string, universityName: string): {
        subject: string;
        body: string;
    };
    buildWaitingEmailTemplate(candidateName: string, universityName: string): {
        subject: string;
        body: string;
    };
    migrateUniversityIds(): Promise<{
        modifiedCount: number;
        message: string;
    }>;
    getUniversityIdMap(): Promise<{
        universities: (import("mongoose").Document<unknown, {}, UniversityDocument, {}, import("mongoose").DefaultSchemaOptions> & University & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
        sentApps: (import("mongoose").Document<unknown, {}, ApplicationDocument, {}, import("mongoose").DefaultSchemaOptions> & Application & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
    getUniversityReplies(): import("mongoose").Query<(import("mongoose").Document<unknown, {}, ApplicationDocument, {}, import("mongoose").DefaultSchemaOptions> & Application & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[], import("mongoose").Document<unknown, {}, ApplicationDocument, {}, import("mongoose").DefaultSchemaOptions> & Application & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, {}, ApplicationDocument, "find", {}>;
}
