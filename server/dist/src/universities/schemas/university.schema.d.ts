import { Document } from 'mongoose';
import { AccountStatus } from '../../common/enums';
export type UniversityDocument = University & Document;
declare class Program {
    name: string;
    duration: number;
    durationUnit: string;
    tuitionFee: number;
    currency: string;
    installments: number;
    availableSeats: number;
    description: string;
}
declare class Module {
    name: string;
    programs: Program[];
}
export declare class University {
    name: string;
    email: string;
    password: string;
    phone: string;
    city: string;
    district: string;
    address: string;
    logo: string;
    website: string;
    about: string;
    modules: Module[];
    requirements: string[];
    status: AccountStatus;
    rejectionReason: string;
    isVerified: boolean;
}
export declare const UniversitySchema: import("mongoose").Schema<University, import("mongoose").Model<University, any, any, any, any, any, University>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, University, Document<unknown, {}, University, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<University & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    name?: import("mongoose").SchemaDefinitionProperty<string, University, Document<unknown, {}, University, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<University & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    email?: import("mongoose").SchemaDefinitionProperty<string, University, Document<unknown, {}, University, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<University & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    password?: import("mongoose").SchemaDefinitionProperty<string, University, Document<unknown, {}, University, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<University & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    phone?: import("mongoose").SchemaDefinitionProperty<string, University, Document<unknown, {}, University, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<University & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    city?: import("mongoose").SchemaDefinitionProperty<string, University, Document<unknown, {}, University, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<University & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    district?: import("mongoose").SchemaDefinitionProperty<string, University, Document<unknown, {}, University, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<University & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    address?: import("mongoose").SchemaDefinitionProperty<string, University, Document<unknown, {}, University, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<University & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    logo?: import("mongoose").SchemaDefinitionProperty<string, University, Document<unknown, {}, University, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<University & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    website?: import("mongoose").SchemaDefinitionProperty<string, University, Document<unknown, {}, University, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<University & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    about?: import("mongoose").SchemaDefinitionProperty<string, University, Document<unknown, {}, University, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<University & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    modules?: import("mongoose").SchemaDefinitionProperty<Module[], University, Document<unknown, {}, University, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<University & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    requirements?: import("mongoose").SchemaDefinitionProperty<string[], University, Document<unknown, {}, University, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<University & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<AccountStatus, University, Document<unknown, {}, University, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<University & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    rejectionReason?: import("mongoose").SchemaDefinitionProperty<string, University, Document<unknown, {}, University, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<University & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isVerified?: import("mongoose").SchemaDefinitionProperty<boolean, University, Document<unknown, {}, University, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<University & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, University>;
export {};
