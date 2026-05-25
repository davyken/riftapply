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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationSchema = exports.Application = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const enums_1 = require("../../common/enums");
let Document_ = class Document_ {
    name;
    url;
    publicId;
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Document_.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Document_.prototype, "url", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Document_.prototype, "publicId", void 0);
Document_ = __decorate([
    (0, mongoose_1.Schema)()
], Document_);
let AuditEntry = class AuditEntry {
    action;
    by;
    at;
    note;
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], AuditEntry.prototype, "action", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], AuditEntry.prototype, "by", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], AuditEntry.prototype, "at", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], AuditEntry.prototype, "note", void 0);
AuditEntry = __decorate([
    (0, mongoose_1.Schema)()
], AuditEntry);
let Application = class Application {
    applicantId;
    applicantType;
    applicantName;
    applicantEmail;
    applicantPhone;
    universityId;
    universityName;
    moduleName;
    programName;
    documents;
    status;
    adminNote;
    rejectionReason;
    universityResponse;
    universityDecision;
    approvedAt;
    sentToUniversityAt;
    universityRespondedAt;
    candidateNotifiedAt;
    auditLog;
};
exports.Application = Application;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Application.prototype, "applicantId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ['student', 'agent'], required: true }),
    __metadata("design:type", String)
], Application.prototype, "applicantType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Application.prototype, "applicantName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Application.prototype, "applicantEmail", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Application.prototype, "applicantPhone", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'University', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Application.prototype, "universityId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Application.prototype, "universityName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Application.prototype, "moduleName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Application.prototype, "programName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Document_], default: [] }),
    __metadata("design:type", Array)
], Application.prototype, "documents", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: enums_1.ApplicationStatus, default: enums_1.ApplicationStatus.PENDING_REVIEW }),
    __metadata("design:type", String)
], Application.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Application.prototype, "adminNote", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Application.prototype, "rejectionReason", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Application.prototype, "universityResponse", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Application.prototype, "universityDecision", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Application.prototype, "approvedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Application.prototype, "sentToUniversityAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Application.prototype, "universityRespondedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Application.prototype, "candidateNotifiedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [AuditEntry], default: [] }),
    __metadata("design:type", Array)
], Application.prototype, "auditLog", void 0);
exports.Application = Application = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Application);
exports.ApplicationSchema = mongoose_1.SchemaFactory.createForClass(Application);
//# sourceMappingURL=application.schema.js.map