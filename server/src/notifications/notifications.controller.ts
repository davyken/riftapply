import { Controller, Get, Param, Put, UseGuards, Request } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification, NotificationDocument } from './schemas/notification.schema';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
  ) {}

  @Get('mine')
  getMyNotifications(@Request() req: any) {
    return this.notificationModel
      .find({ recipientId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
  }

  @Put(':id/read')
  async markAsRead(@Param('id') id: string, @Request() req: any) {
    return this.notificationModel.findOneAndUpdate(
      { _id: id, recipientId: req.user._id },
      { isRead: true, readAt: new Date() },
      { new: true },
    );
  }
}
