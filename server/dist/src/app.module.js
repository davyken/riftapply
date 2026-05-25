"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const throttler_1 = require("@nestjs/throttler");
const core_1 = require("@nestjs/core");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const agents_module_1 = require("./agents/agents.module");
const universities_module_1 = require("./universities/universities.module");
const applications_module_1 = require("./applications/applications.module");
const admin_module_1 = require("./admin/admin.module");
const notifications_module_1 = require("./notifications/notifications.module");
const cloudinary_module_1 = require("./cloudinary/cloudinary.module");
const mail_module_1 = require("./mail/mail.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            mongoose_1.MongooseModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    uri: config.get('MONGODB_URI'),
                    maxPoolSize: 100,
                    minPoolSize: 5,
                    serverSelectionTimeoutMS: 5000,
                    socketTimeoutMS: 45000,
                    connectTimeoutMS: 10000,
                }),
            }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    name: 'default',
                    ttl: 60000,
                    limit: 100,
                },
                {
                    name: 'auth',
                    ttl: 60000,
                    limit: 10,
                },
            ]),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            agents_module_1.AgentsModule,
            universities_module_1.UniversitiesModule,
            applications_module_1.ApplicationsModule,
            admin_module_1.AdminModule,
            notifications_module_1.NotificationsModule,
            cloudinary_module_1.CloudinaryModule,
            mail_module_1.MailModule,
        ],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map