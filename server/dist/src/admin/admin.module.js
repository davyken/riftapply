"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const admin_controller_1 = require("./admin.controller");
const admin_service_1 = require("./admin.service");
const user_schema_1 = require("../users/schemas/user.schema");
const agent_schema_1 = require("../agents/schemas/agent.schema");
const university_schema_1 = require("../universities/schemas/university.schema");
const application_schema_1 = require("../applications/schemas/application.schema");
const notification_schema_1 = require("../notifications/schemas/notification.schema");
const mail_module_1 = require("../mail/mail.module");
const notifications_module_1 = require("../notifications/notifications.module");
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: agent_schema_1.Agent.name, schema: agent_schema_1.AgentSchema },
                { name: university_schema_1.University.name, schema: university_schema_1.UniversitySchema },
                { name: application_schema_1.Application.name, schema: application_schema_1.ApplicationSchema },
                { name: notification_schema_1.Notification.name, schema: notification_schema_1.NotificationSchema },
            ]),
            mail_module_1.MailModule,
            notifications_module_1.NotificationsModule,
        ],
        controllers: [admin_controller_1.AdminController],
        providers: [admin_service_1.AdminService],
    })
], AdminModule);
//# sourceMappingURL=admin.module.js.map