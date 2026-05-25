import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Application, ApplicationSchema } from './schemas/application.schema';
import { ApplicationsController } from './applications.controller';
import { ApplicationsService } from './applications.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { User, UserSchema } from '../users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Application.name, schema: ApplicationSchema },
      { name: User.name, schema: UserSchema },
    ]),
    CloudinaryModule,
    NotificationsModule,
  ],
  controllers: [ApplicationsController],
  providers: [ApplicationsService],
  exports: [MongooseModule, ApplicationsService],
})
export class ApplicationsModule {}
