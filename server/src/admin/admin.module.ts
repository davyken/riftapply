import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User, UserSchema } from '../users/schemas/user.schema';
import { Agent, AgentSchema } from '../agents/schemas/agent.schema';
import { University, UniversitySchema } from '../universities/schemas/university.schema';
import { Application, ApplicationSchema } from '../applications/schemas/application.schema';
import { Notification, NotificationSchema } from '../notifications/schemas/notification.schema';
import { MailModule } from '../mail/mail.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Agent.name, schema: AgentSchema },
      { name: University.name, schema: UniversitySchema },
      { name: Application.name, schema: ApplicationSchema },
      { name: Notification.name, schema: NotificationSchema },
    ]),
    MailModule,
    NotificationsModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
