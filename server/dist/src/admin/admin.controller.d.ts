import { AdminService } from './admin.service';
export declare class AdminController {
    private adminService;
    constructor(adminService: AdminService);
    getStats(): Promise<{
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
    getPendingAgents(): import("mongoose").Query<(import("mongoose").Document<unknown, {}, import("../agents/schemas/agent.schema").AgentDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../agents/schemas/agent.schema").Agent & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[], import("mongoose").Document<unknown, {}, import("../agents/schemas/agent.schema").AgentDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../agents/schemas/agent.schema").Agent & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, {}, import("../agents/schemas/agent.schema").AgentDocument, "find", {}>;
    getPendingUniversities(): import("mongoose").Query<(import("mongoose").Document<unknown, {}, import("../universities/schemas/university.schema").UniversityDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../universities/schemas/university.schema").University & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[], import("mongoose").Document<unknown, {}, import("../universities/schemas/university.schema").UniversityDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../universities/schemas/university.schema").University & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, {}, import("../universities/schemas/university.schema").UniversityDocument, "find", {}>;
    approveAgent(id: string): Promise<import("mongoose").Document<unknown, {}, import("../agents/schemas/agent.schema").AgentDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../agents/schemas/agent.schema").Agent & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    rejectAgent(id: string, reason: string): Promise<import("mongoose").Document<unknown, {}, import("../agents/schemas/agent.schema").AgentDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../agents/schemas/agent.schema").Agent & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    approveUniversity(id: string): Promise<import("mongoose").Document<unknown, {}, import("../universities/schemas/university.schema").UniversityDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../universities/schemas/university.schema").University & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    rejectUniversity(id: string, reason: string): Promise<import("mongoose").Document<unknown, {}, import("../universities/schemas/university.schema").UniversityDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../universities/schemas/university.schema").University & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    getAllAgents(status?: string): import("mongoose").Query<(import("mongoose").Document<unknown, {}, import("../agents/schemas/agent.schema").AgentDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../agents/schemas/agent.schema").Agent & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[], import("mongoose").Document<unknown, {}, import("../agents/schemas/agent.schema").AgentDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../agents/schemas/agent.schema").Agent & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, {}, import("../agents/schemas/agent.schema").AgentDocument, "find", {}>;
    deleteAgent(id: string): Promise<{
        deleted: boolean;
    }>;
    getAllUniversities(status?: string): import("mongoose").Query<(import("mongoose").Document<unknown, {}, import("../universities/schemas/university.schema").UniversityDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../universities/schemas/university.schema").University & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[], import("mongoose").Document<unknown, {}, import("../universities/schemas/university.schema").UniversityDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../universities/schemas/university.schema").University & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, {}, import("../universities/schemas/university.schema").UniversityDocument, "find", {}>;
    deleteUniversity(id: string): Promise<{
        deleted: boolean;
    }>;
    getAllStudents(): import("mongoose").Query<(import("mongoose").Document<unknown, {}, import("../users/schemas/user.schema").UserDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../users/schemas/user.schema").User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[], import("mongoose").Document<unknown, {}, import("../users/schemas/user.schema").UserDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../users/schemas/user.schema").User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, {}, import("../users/schemas/user.schema").UserDocument, "find", {}>;
    deleteStudent(id: string): Promise<{
        deleted: boolean;
    }>;
    getAllApplications(status?: string): import("mongoose").Query<(import("mongoose").Document<unknown, {}, import("../applications/schemas/application.schema").ApplicationDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../applications/schemas/application.schema").Application & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[], import("mongoose").Document<unknown, {}, import("../applications/schemas/application.schema").ApplicationDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../applications/schemas/application.schema").Application & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, {}, import("../applications/schemas/application.schema").ApplicationDocument, "find", {}>;
    getApplication(id: string): Promise<import("mongoose").Document<unknown, {}, import("../applications/schemas/application.schema").ApplicationDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../applications/schemas/application.schema").Application & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    approveApplication(id: string, req: any): Promise<import("mongoose").Document<unknown, {}, import("../applications/schemas/application.schema").ApplicationDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../applications/schemas/application.schema").Application & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    rejectApplication(id: string, req: any, reason: string): Promise<import("mongoose").Document<unknown, {}, import("../applications/schemas/application.schema").ApplicationDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../applications/schemas/application.schema").Application & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    sendToUniversity(id: string, req: any): Promise<import("mongoose").Document<unknown, {}, import("../applications/schemas/application.schema").ApplicationDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../applications/schemas/application.schema").Application & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    notifyCandidate(id: string, req: any, body: {
        sendEmail: boolean;
        emailSubject?: string;
        emailBody?: string;
        sendDashboard?: boolean;
    }): Promise<{
        message: string;
        channels: any[];
    }>;
    getEmailTemplate(id: string, type: 'acceptance' | 'rejection' | 'waiting', candidateName: string, universityName: string, program: string): {
        subject: string;
        body: string;
    };
    migrateUniversityIds(): Promise<{
        modifiedCount: number;
        message: string;
    }>;
    getUniversityIdMap(): Promise<{
        universities: (import("mongoose").Document<unknown, {}, import("../universities/schemas/university.schema").UniversityDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../universities/schemas/university.schema").University & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
        sentApps: (import("mongoose").Document<unknown, {}, import("../applications/schemas/application.schema").ApplicationDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../applications/schemas/application.schema").Application & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
    getUniversityReplies(): import("mongoose").Query<(import("mongoose").Document<unknown, {}, import("../applications/schemas/application.schema").ApplicationDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../applications/schemas/application.schema").Application & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[], import("mongoose").Document<unknown, {}, import("../applications/schemas/application.schema").ApplicationDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../applications/schemas/application.schema").Application & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, {}, import("../applications/schemas/application.schema").ApplicationDocument, "find", {}>;
}
