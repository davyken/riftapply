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
exports.UniversitySchema = exports.University = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const enums_1 = require("../../common/enums");
let Program = class Program {
    name;
    duration;
    durationUnit;
    tuitionFee;
    currency;
    installments;
    availableSeats;
    description;
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Program.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Program.prototype, "duration", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'years' }),
    __metadata("design:type", String)
], Program.prototype, "durationUnit", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Program.prototype, "tuitionFee", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Program.prototype, "currency", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 1 }),
    __metadata("design:type", Number)
], Program.prototype, "installments", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Program.prototype, "availableSeats", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Program.prototype, "description", void 0);
Program = __decorate([
    (0, mongoose_1.Schema)()
], Program);
let Module = class Module {
    name;
    programs;
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Module.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Program], default: [] }),
    __metadata("design:type", Array)
], Module.prototype, "programs", void 0);
Module = __decorate([
    (0, mongoose_1.Schema)()
], Module);
let University = class University {
    name;
    email;
    password;
    phone;
    city;
    district;
    address;
    logo;
    website;
    about;
    modules;
    requirements;
    status;
    rejectionReason;
    isVerified;
    emailVerified;
    verificationExpiry;
};
exports.University = University;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], University.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, lowercase: true }),
    __metadata("design:type", String)
], University.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], University.prototype, "password", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], University.prototype, "phone", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], University.prototype, "city", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], University.prototype, "district", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], University.prototype, "address", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], University.prototype, "logo", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], University.prototype, "website", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], University.prototype, "about", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Module], default: [] }),
    __metadata("design:type", Array)
], University.prototype, "modules", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: ['Passport / National ID', 'English Proficiency Certificate', 'University Transcripts', 'Statement of Purpose'] }),
    __metadata("design:type", Array)
], University.prototype, "requirements", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: enums_1.AccountStatus, default: enums_1.AccountStatus.PENDING }),
    __metadata("design:type", String)
], University.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], University.prototype, "rejectionReason", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], University.prototype, "isVerified", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], University.prototype, "emailVerified", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], University.prototype, "verificationExpiry", void 0);
exports.University = University = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], University);
exports.UniversitySchema = mongoose_1.SchemaFactory.createForClass(University);
exports.UniversitySchema.index({ verificationExpiry: 1 }, { expireAfterSeconds: 0 });
//# sourceMappingURL=university.schema.js.map