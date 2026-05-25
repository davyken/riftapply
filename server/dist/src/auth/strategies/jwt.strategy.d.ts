import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { UserDocument } from '../../users/schemas/user.schema';
import { AgentDocument } from '../../agents/schemas/agent.schema';
import { UniversityDocument } from '../../universities/schemas/university.schema';
interface JwtPayload {
    sub: string;
    email: string;
    role: string;
}
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private userModel;
    private agentModel;
    private universityModel;
    constructor(config: ConfigService, userModel: Model<UserDocument>, agentModel: Model<AgentDocument>, universityModel: Model<UniversityDocument>);
    validate(payload: JwtPayload): Promise<any>;
}
export {};
