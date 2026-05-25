"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ApplicationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const application_schema_1 = require("./schemas/application.schema");
const cloudinary_service_1 = require("../cloudinary/cloudinary.service");
const enums_1 = require("../common/enums");
const notification_schema_1 = require("../notifications/schemas/notification.schema");
const user_schema_1 = require("../users/schemas/user.schema");
let ApplicationsService = ApplicationsService_1 = class ApplicationsService {
    applicationModel;
    notificationModel;
    userModel;
    cloudinaryService;
    logger = new common_1.Logger(ApplicationsService_1.name);
    constructor(applicationModel, notificationModel, userModel, cloudinaryService) {
        this.applicationModel = applicationModel;
        this.notificationModel = notificationModel;
        this.userModel = userModel;
        this.cloudinaryService = cloudinaryService;
    }
    async onModuleInit() {
        const result = await this.applicationModel.collection.updateMany({ universityId: { $type: 'string' } }, [{ $set: { universityId: { $toObjectId: '$universityId' } } }]);
        if (result.modifiedCount > 0) {
            this.logger.log(`Migrated ${result.modifiedCount} application(s): universityId string → ObjectId`);
        }
    }
    async createApplication(applicantData, body, files) {
        const uploadedDocs = await Promise.all(files.map(async (file) => {
            const result = await this.cloudinaryService.uploadFile(file, 'applications/documents');
            return { name: file.originalname, url: result.secure_url, publicId: result.public_id };
        }));
        const application = await this.applicationModel.create({
            applicantId: applicantData.id,
            applicantType: applicantData.type,
            applicantName: applicantData.name,
            applicantEmail: applicantData.email,
            applicantPhone: applicantData.phone,
            ...body,
            universityId: new mongoose_2.Types.ObjectId(String(body.universityId)),
            documents: uploadedDocs,
            status: enums_1.ApplicationStatus.PENDING_REVIEW,
        });
        return application;
    }
    findMyApplications(applicantId) {
        return this.applicationModel.find({ applicantId }).sort({ createdAt: -1 });
    }
    async findOne(id) {
        const app = await this.applicationModel.findById(id);
        if (!app)
            throw new common_1.NotFoundException('Application not found');
        return app;
    }
    async findByUniversity(universityId) {
        const uidStr = String(universityId);
        const uidObj = new mongoose_2.Types.ObjectId(uidStr);
        const statuses = [
            enums_1.ApplicationStatus.SENT_TO_UNIVERSITY,
            enums_1.ApplicationStatus.AWAITING_UNIVERSITY_RESPONSE,
            enums_1.ApplicationStatus.ACCEPTED_BY_UNIVERSITY,
            enums_1.ApplicationStatus.REFUSED_BY_UNIVERSITY,
            enums_1.ApplicationStatus.INFO_REQUESTED,
        ];
        return this.applicationModel.collection
            .find({
            $or: [{ universityId: uidObj }, { universityId: uidStr }],
            status: { $in: statuses },
        })
            .sort({ sentToUniversityAt: -1 })
            .toArray();
    }
    async universityRespond(applicationId, universityId, decision, response) {
        const app = await this.applicationModel.findById(applicationId);
        if (!app || String(app.universityId) !== String(universityId)) {
            throw new common_1.NotFoundException('Application not found');
        }
        app.universityDecision = decision;
        app.universityResponse = response;
        app.universityRespondedAt = new Date();
        if (decision === 'accepted')
            app.status = enums_1.ApplicationStatus.ACCEPTED_BY_UNIVERSITY;
        else if (decision === 'refused')
            app.status = enums_1.ApplicationStatus.REFUSED_BY_UNIVERSITY;
        else
            app.status = enums_1.ApplicationStatus.INFO_REQUESTED;
        app.auditLog.push({ action: `University responded: ${decision}`, by: 'university', at: new Date(), note: response });
        await app.save();
        const admins = await this.userModel.find({ role: enums_1.UserRole.ADMIN }).select('_id email');
        const decisionLabel = decision === 'accepted' ? 'accepted' : decision === 'refused' ? 'refused' : 'requested more info for';
        const notifSubject = `University decision: ${app.universityName} ${decisionLabel} ${app.applicantName}`;
        const notifBody = `${app.universityName} has ${decisionLabel} the application from ${app.applicantName} for ${app.programName}${response ? `.\n\nNote: ${response}` : '.'}`;
        for (const admin of admins) {
            await this.notificationModel.create({
                recipientId: admin._id,
                recipientEmail: admin.email,
                recipientType: 'admin',
                type: enums_1.NotificationType.DASHBOARD,
                subject: notifSubject,
                body: notifBody,
                applicationId: app._id,
                sentBy: 'university',
            });
        }
        return app;
    }
};
exports.ApplicationsService = ApplicationsService;
exports.ApplicationsService = ApplicationsService = ApplicationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(application_schema_1.Application.name)),
    __param(1, (0, mongoose_1.InjectModel)(notification_schema_1.Notification.name)),
    __param(2, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        cloudinary_service_1.CloudinaryService])
], ApplicationsService);
//# sourceMappingURL=applications.service.js.map