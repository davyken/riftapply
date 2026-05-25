import { AgentType } from '../../common/enums';
export declare class RegisterStudentDto {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    city?: string;
    desiredField?: string;
    desiredModule?: string;
}
export declare class RegisterAgentDto {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    agentType: AgentType;
    city?: string;
    companyName?: string;
    companyLocation?: string;
}
export declare class RegisterUniversityDto {
    name: string;
    email: string;
    password: string;
    phone: string;
    city: string;
    district?: string;
    address?: string;
    website?: string;
}
export declare class LoginDto {
    email: string;
    password: string;
    role: string;
}
