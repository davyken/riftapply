import { ApplicationsService } from './applications.service';
export declare class ApplicationsController {
    private applicationsService;
    constructor(applicationsService: ApplicationsService);
    createApplication(req: any, body: any, files: Express.Multer.File[]): Promise<import("mongoose").Document<unknown, {}, import("./schemas/application.schema").ApplicationDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/application.schema").Application & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    getMyApplications(req: any): import("mongoose").Query<(import("mongoose").Document<unknown, {}, import("./schemas/application.schema").ApplicationDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/application.schema").Application & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[], import("mongoose").Document<unknown, {}, import("./schemas/application.schema").ApplicationDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/application.schema").Application & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, {}, import("./schemas/application.schema").ApplicationDocument, "find", {}>;
    getUniversityApplications(req: any): Promise<import("mongodb").WithId<import("bson").Document>[]>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/application.schema").ApplicationDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/application.schema").Application & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    universityRespond(id: string, req: any, body: {
        decision: 'accepted' | 'refused' | 'info_requested';
        response: string;
    }): Promise<import("mongoose").Document<unknown, {}, import("./schemas/application.schema").ApplicationDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/application.schema").Application & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
}
