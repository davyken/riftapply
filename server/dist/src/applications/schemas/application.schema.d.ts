import { Document, Types } from 'mongoose';
import { ApplicationStatus } from '../../common/enums';
export type ApplicationDocument = Application & Document;
declare class Document_ {
    name: string;
    url: string;
    publicId: string;
}
declare class AuditEntry {
    action: string;
    by: string;
    at: Date;
    note: string;
}
export declare class Application {
    applicantId: Types.ObjectId;
    applicantType: string;
    applicantName: string;
    applicantEmail: string;
    applicantPhone: string;
    universityId: Types.ObjectId;
    universityName: string;
    moduleName: string;
    programName: string;
    documents: Document_[];
    status: ApplicationStatus;
    adminNote: string;
    rejectionReason: string;
    universityResponse: string;
    universityDecision: string;
    approvedAt: Date;
    sentToUniversityAt: Date;
    universityRespondedAt: Date;
    candidateNotifiedAt: Date;
    auditLog: AuditEntry[];
}
export declare const ApplicationSchema: import("mongoose").Schema<Application, import("mongoose").Model<Application, any, any, any, any, any, Application>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Application, Document<unknown, {}, Application, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Application & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    applicantId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Application, Document<unknown, {}, Application, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Application & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    applicantType?: import("mongoose").SchemaDefinitionProperty<string, Application, Document<unknown, {}, Application, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Application & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    applicantName?: import("mongoose").SchemaDefinitionProperty<string, Application, Document<unknown, {}, Application, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Application & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    applicantEmail?: import("mongoose").SchemaDefinitionProperty<string, Application, Document<unknown, {}, Application, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Application & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    applicantPhone?: import("mongoose").SchemaDefinitionProperty<string, Application, Document<unknown, {}, Application, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Application & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    universityId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Application, Document<unknown, {}, Application, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Application & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    universityName?: import("mongoose").SchemaDefinitionProperty<string, Application, Document<unknown, {}, Application, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Application & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    moduleName?: import("mongoose").SchemaDefinitionProperty<string, Application, Document<unknown, {}, Application, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Application & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    programName?: import("mongoose").SchemaDefinitionProperty<string, Application, Document<unknown, {}, Application, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Application & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    documents?: import("mongoose").SchemaDefinitionProperty<Document_[], Application, Document<unknown, {}, Application, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Application & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<ApplicationStatus, Application, Document<unknown, {}, Application, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Application & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    adminNote?: import("mongoose").SchemaDefinitionProperty<string, Application, Document<unknown, {}, Application, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Application & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    rejectionReason?: import("mongoose").SchemaDefinitionProperty<string, Application, Document<unknown, {}, Application, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Application & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    universityResponse?: import("mongoose").SchemaDefinitionProperty<string, Application, Document<unknown, {}, Application, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Application & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    universityDecision?: import("mongoose").SchemaDefinitionProperty<string, Application, Document<unknown, {}, Application, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Application & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    approvedAt?: import("mongoose").SchemaDefinitionProperty<Date, Application, Document<unknown, {}, Application, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Application & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    sentToUniversityAt?: import("mongoose").SchemaDefinitionProperty<Date, Application, Document<unknown, {}, Application, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Application & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    universityRespondedAt?: import("mongoose").SchemaDefinitionProperty<Date, Application, Document<unknown, {}, Application, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Application & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    candidateNotifiedAt?: import("mongoose").SchemaDefinitionProperty<Date, Application, Document<unknown, {}, Application, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Application & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    auditLog?: import("mongoose").SchemaDefinitionProperty<AuditEntry[], Application, Document<unknown, {}, Application, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Application & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Application>;
export {};
