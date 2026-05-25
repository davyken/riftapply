import { Model } from 'mongoose';
import { Notification, NotificationDocument } from './schemas/notification.schema';
export declare class NotificationsController {
    private notificationModel;
    constructor(notificationModel: Model<NotificationDocument>);
    getMyNotifications(req: any): import("mongoose").Query<(import("mongoose").Document<unknown, {}, NotificationDocument, {}, import("mongoose").DefaultSchemaOptions> & Notification & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[], import("mongoose").Document<unknown, {}, NotificationDocument, {}, import("mongoose").DefaultSchemaOptions> & Notification & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, {}, NotificationDocument, "find", {}>;
    markAsRead(id: string, req: any): Promise<(import("mongoose").Document<unknown, {}, NotificationDocument, {}, import("mongoose").DefaultSchemaOptions> & Notification & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
}
