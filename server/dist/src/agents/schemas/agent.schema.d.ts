import { Document } from 'mongoose';
import { AccountStatus, AgentType } from '../../common/enums';
export type AgentDocument = Agent & Document;
export declare class Agent {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    agentType: AgentType;
    city: string;
    avatar: string;
    cniDocument: string;
    companyName: string;
    companyLocation: string;
    companyLogo: string;
    registrationDocument: string;
    status: AccountStatus;
    rejectionReason: string;
    isVerified: boolean;
    emailVerified: boolean;
    verificationExpiry: Date;
}
export declare const AgentSchema: import("mongoose").Schema<Agent, import("mongoose").Model<Agent, any, any, any, any, any, Agent>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Agent, Document<unknown, {}, Agent, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Agent & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    firstName?: import("mongoose").SchemaDefinitionProperty<string, Agent, Document<unknown, {}, Agent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Agent & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    lastName?: import("mongoose").SchemaDefinitionProperty<string, Agent, Document<unknown, {}, Agent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Agent & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    email?: import("mongoose").SchemaDefinitionProperty<string, Agent, Document<unknown, {}, Agent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Agent & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    password?: import("mongoose").SchemaDefinitionProperty<string, Agent, Document<unknown, {}, Agent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Agent & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    phone?: import("mongoose").SchemaDefinitionProperty<string, Agent, Document<unknown, {}, Agent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Agent & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    agentType?: import("mongoose").SchemaDefinitionProperty<AgentType, Agent, Document<unknown, {}, Agent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Agent & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    city?: import("mongoose").SchemaDefinitionProperty<string, Agent, Document<unknown, {}, Agent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Agent & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    avatar?: import("mongoose").SchemaDefinitionProperty<string, Agent, Document<unknown, {}, Agent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Agent & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    cniDocument?: import("mongoose").SchemaDefinitionProperty<string, Agent, Document<unknown, {}, Agent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Agent & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    companyName?: import("mongoose").SchemaDefinitionProperty<string, Agent, Document<unknown, {}, Agent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Agent & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    companyLocation?: import("mongoose").SchemaDefinitionProperty<string, Agent, Document<unknown, {}, Agent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Agent & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    companyLogo?: import("mongoose").SchemaDefinitionProperty<string, Agent, Document<unknown, {}, Agent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Agent & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    registrationDocument?: import("mongoose").SchemaDefinitionProperty<string, Agent, Document<unknown, {}, Agent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Agent & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<AccountStatus, Agent, Document<unknown, {}, Agent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Agent & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    rejectionReason?: import("mongoose").SchemaDefinitionProperty<string, Agent, Document<unknown, {}, Agent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Agent & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isVerified?: import("mongoose").SchemaDefinitionProperty<boolean, Agent, Document<unknown, {}, Agent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Agent & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    emailVerified?: import("mongoose").SchemaDefinitionProperty<boolean, Agent, Document<unknown, {}, Agent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Agent & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    verificationExpiry?: import("mongoose").SchemaDefinitionProperty<Date, Agent, Document<unknown, {}, Agent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Agent & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Agent>;
