import { Model } from 'mongoose';
import { University, UniversityDocument } from './schemas/university.schema';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
export declare class UniversitiesService {
    private universityModel;
    private cloudinaryService;
    constructor(universityModel: Model<UniversityDocument>, cloudinaryService: CloudinaryService);
    findAll(): import("mongoose").Query<(import("mongoose").Document<unknown, {}, UniversityDocument, {}, import("mongoose").DefaultSchemaOptions> & University & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
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
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, UniversityDocument, {}, import("mongoose").DefaultSchemaOptions> & University & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    addModule(universityId: string, moduleData: any): Promise<import("mongoose").Document<unknown, {}, UniversityDocument, {}, import("mongoose").DefaultSchemaOptions> & University & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    updateProfile(universityId: string, data: any, logo?: Express.Multer.File): Promise<(import("mongoose").Document<unknown, {}, UniversityDocument, {}, import("mongoose").DefaultSchemaOptions> & University & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    parsePrerequisitesPdf(file: Express.Multer.File): Promise<string[]>;
}
