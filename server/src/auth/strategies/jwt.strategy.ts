import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../users/schemas/user.schema';
import { Agent, AgentDocument } from '../../agents/schemas/agent.schema';
import { University, UniversityDocument } from '../../universities/schemas/university.schema';

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Agent.name) private agentModel: Model<AgentDocument>,
    @InjectModel(University.name) private universityModel: Model<UniversityDocument>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>('JWT_SECRET') as string,
    });
  }

  async validate(payload: JwtPayload) {
    const { sub, role } = payload;
    let user: any;

    if (role === 'student') {
      user = await this.userModel.findById(sub).select('-password');
    } else if (role === 'agent') {
      user = await this.agentModel.findById(sub).select('-password');
    } else if (role === 'university') {
      user = await this.universityModel.findById(sub).select('-password');
    } else if (role === 'admin') {
      user = await this.userModel.findById(sub).select('-password');
    }

    if (!user) throw new UnauthorizedException();
    return { ...user.toObject(), role };
  }
}
