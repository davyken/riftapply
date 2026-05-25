import { UniversitiesService } from './universities.service';
export declare class UniversitiesController {
    private universitiesService;
    constructor(universitiesService: UniversitiesService);
    parsePrerequisites(file: Express.Multer.File): Promise<string[]>;
    findAll(): import("mongoose").Query<(import("mongoose").Document<unknown, {}, import("./schemas/university.schema").UniversityDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/university.schema").University & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[], import("mongoose").Document<unknown, {}, import("./schemas/university.schema").UniversityDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/university.schema").University & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, {}, import("./schemas/university.schema").UniversityDocument, "find", {}>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/university.schema").UniversityDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/university.schema").University & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    updateProfile(req: any, body: any, logo?: Express.Multer.File): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/university.schema").UniversityDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/university.schema").University & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
}
