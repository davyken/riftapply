import { OnModuleInit } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { Application, ApplicationDocument } from './schemas/application.schema';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { NotificationDocument } from '../notifications/schemas/notification.schema';
import { UserDocument } from '../users/schemas/user.schema';
export declare class ApplicationsService implements OnModuleInit {
    private applicationModel;
    private notificationModel;
    private userModel;
    private cloudinaryService;
    private readonly logger;
    constructor(applicationModel: Model<ApplicationDocument>, notificationModel: Model<NotificationDocument>, userModel: Model<UserDocument>, cloudinaryService: CloudinaryService);
    onModuleInit(): Promise<void>;
    createApplication(applicantData: {
        id: string;
        type: 'student' | 'agent';
        name: string;
        email: string;
        phone: string;
    }, body: {
        universityId: string;
        universityName: string;
        moduleName: string;
        programName: string;
    }, files: Express.Multer.File[]): Promise<import("mongoose").Document<unknown, {}, ApplicationDocument, {}, import("mongoose").DefaultSchemaOptions> & Application & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findMyApplications(applicantId: string): import("mongoose").Query<(import("mongoose").Document<unknown, {}, ApplicationDocument, {}, import("mongoose").DefaultSchemaOptions> & Application & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[], import("mongoose").Document<unknown, {}, ApplicationDocument, {}, import("mongoose").DefaultSchemaOptions> & Application & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, {}, ApplicationDocument, "find", {}>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, ApplicationDocument, {}, import("mongoose").DefaultSchemaOptions> & Application & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findByUniversity(universityId: any): Promise<import("mongodb").WithId<import("bson").Document>[]>;
    universityRespond(applicationId: string, universityId: string, decision: 'accepted' | 'refused' | 'info_requested', response: string): Promise<import("mongoose").Document<unknown, {}, ApplicationDocument, {}, import("mongoose").DefaultSchemaOptions> & Application & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
}
