import { Injectable, NotFoundException, OnModuleInit, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Application, ApplicationDocument } from './schemas/application.schema';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ApplicationStatus, NotificationType, UserRole } from '../common/enums';
import { Notification, NotificationDocument } from '../notifications/schemas/notification.schema';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class ApplicationsService implements OnModuleInit {
  private readonly logger = new Logger(ApplicationsService.name);

  constructor(
    @InjectModel(Application.name) private applicationModel: Model<ApplicationDocument>,
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async onModuleInit() {
    const result = await this.applicationModel.collection.updateMany(
      { universityId: { $type: 'string' } },
      [{ $set: { universityId: { $toObjectId: '$universityId' } } }],
    );
    if (result.modifiedCount > 0) {
      this.logger.log(`Migrated ${result.modifiedCount} application(s): universityId string → ObjectId`);
    }
  }

  async createApplication(
    applicantData: {
      id: string;
      type: 'student' | 'agent';
      name: string;
      email: string;
      phone: string;
    },
    body: {
      universityId: string;
      universityName: string;
      moduleName: string;
      programName: string;
    },
    files: Express.Multer.File[],
  ) {
    const uploadedDocs = await Promise.all(
      files.map(async (file) => {
        const result = await this.cloudinaryService.uploadFile(file, 'applications/documents');
        return { name: file.originalname, url: result.secure_url, publicId: result.public_id };
      }),
    );

    const application = await this.applicationModel.create({
      applicantId: applicantData.id,
      applicantType: applicantData.type,
      applicantName: applicantData.name,
      applicantEmail: applicantData.email,
      applicantPhone: applicantData.phone,
      ...body,
      universityId: new Types.ObjectId(String(body.universityId)),
      documents: uploadedDocs,
      status: ApplicationStatus.PENDING_REVIEW,
    });

    return application;
  }

  findMyApplications(applicantId: string) {
    return this.applicationModel.find({ applicantId }).sort({ createdAt: -1 });
  }

  async findOne(id: string) {
    const app = await this.applicationModel.findById(id);
    if (!app) throw new NotFoundException('Application not found');
    return app;
  }

  // University: get applications sent to this university.
  // Uses raw collection query to bypass Mongoose's ObjectId casting, since
  // older documents may have universityId stored as a plain string.
  async findByUniversity(universityId: any) {
    const uidStr = String(universityId);
    const uidObj = new Types.ObjectId(uidStr);
    const statuses = [
      ApplicationStatus.SENT_TO_UNIVERSITY,
      ApplicationStatus.AWAITING_UNIVERSITY_RESPONSE,
      ApplicationStatus.ACCEPTED_BY_UNIVERSITY,
      ApplicationStatus.REFUSED_BY_UNIVERSITY,
      ApplicationStatus.INFO_REQUESTED,
    ];
    return this.applicationModel.collection
      .find({
        $or: [{ universityId: uidObj }, { universityId: uidStr }],
        status: { $in: statuses },
      })
      .sort({ sentToUniversityAt: -1 })
      .toArray();
  }

  // University: respond to an application
  async universityRespond(
    applicationId: string,
    universityId: string,
    decision: 'accepted' | 'refused' | 'info_requested',
    response: string,
  ) {
    const app = await this.applicationModel.findById(applicationId);
    if (!app || String(app.universityId) !== String(universityId)) {
      throw new NotFoundException('Application not found');
    }

    app.universityDecision = decision;
    app.universityResponse = response;
    app.universityRespondedAt = new Date();

    if (decision === 'accepted') app.status = ApplicationStatus.ACCEPTED_BY_UNIVERSITY;
    else if (decision === 'refused') app.status = ApplicationStatus.REFUSED_BY_UNIVERSITY;
    else app.status = ApplicationStatus.INFO_REQUESTED;

    app.auditLog.push({ action: `University responded: ${decision}`, by: 'university', at: new Date(), note: response });
    await app.save();

    // Notify all admin users about the university's decision
    const admins = await this.userModel.find({ role: UserRole.ADMIN }).select('_id email');
    const decisionLabel = decision === 'accepted' ? 'accepted' : decision === 'refused' ? 'refused' : 'requested more info for';
    const notifSubject = `University decision: ${app.universityName} ${decisionLabel} ${app.applicantName}`;
    const notifBody = `${app.universityName} has ${decisionLabel} the application from ${app.applicantName} for ${app.programName}${response ? `.\n\nNote: ${response}` : '.'}`;

    for (const admin of admins) {
      await this.notificationModel.create({
        recipientId: admin._id,
        recipientEmail: admin.email,
        recipientType: 'admin',
        type: NotificationType.DASHBOARD,
        subject: notifSubject,
        body: notifBody,
        applicationId: app._id,
        sentBy: 'university',
      });
    }

    return app;
  }
}
