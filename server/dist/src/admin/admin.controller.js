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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const admin_service_1 = require("./admin.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
let AdminController = class AdminController {
    adminService;
    constructor(adminService) {
        this.adminService = adminService;
    }
    getStats() {
        return this.adminService.getDashboardStats();
    }
    getPendingAgents() {
        return this.adminService.getPendingAgents();
    }
    getPendingUniversities() {
        return this.adminService.getPendingUniversities();
    }
    approveAgent(id) {
        return this.adminService.approveAgent(id);
    }
    rejectAgent(id, reason) {
        return this.adminService.rejectAgent(id, reason);
    }
    approveUniversity(id) {
        return this.adminService.approveUniversity(id);
    }
    rejectUniversity(id, reason) {
        return this.adminService.rejectUniversity(id, reason);
    }
    getAllAgents(status) {
        return this.adminService.getAllAgents(status);
    }
    deleteAgent(id) {
        return this.adminService.deleteAgent(id);
    }
    getAllUniversities(status) {
        return this.adminService.getAllUniversities(status);
    }
    deleteUniversity(id) {
        return this.adminService.deleteUniversity(id);
    }
    getAllStudents() {
        return this.adminService.getAllStudents();
    }
    deleteStudent(id) {
        return this.adminService.deleteStudent(id);
    }
    getAllApplications(status) {
        return this.adminService.getAllApplications(status);
    }
    getApplication(id) {
        return this.adminService.getApplicationById(id);
    }
    approveApplication(id, req) {
        return this.adminService.approveApplication(id, req.user._id);
    }
    rejectApplication(id, req, reason) {
        return this.adminService.rejectApplication(id, req.user._id, reason);
    }
    sendToUniversity(id, req) {
        return this.adminService.sendToUniversity(id, req.user._id);
    }
    notifyCandidate(id, req, body) {
        return this.adminService.notifyCandidate(id, req.user._id, body);
    }
    getEmailTemplate(id, type, candidateName, universityName, program) {
        if (type === 'acceptance') {
            return this.adminService.buildAcceptanceEmailTemplate(candidateName, universityName, program);
        }
        else if (type === 'rejection') {
            return this.adminService.buildRejectionEmailTemplate(candidateName, universityName);
        }
        return this.adminService.buildWaitingEmailTemplate(candidateName, universityName);
    }
    broadcastEmail(body) {
        return this.adminService.broadcastEmail(body);
    }
    sendCustomBulkEmail(body) {
        return this.adminService.sendCustomBulkEmail(body);
    }
    migrateUniversityIds() {
        return this.adminService.migrateUniversityIds();
    }
    getUniversityIdMap() {
        return this.adminService.getUniversityIdMap();
    }
    getUniversityReplies() {
        return this.adminService.getUniversityReplies();
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('pending/agents'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getPendingAgents", null);
__decorate([
    (0, common_1.Get)('pending/universities'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getPendingUniversities", null);
__decorate([
    (0, common_1.Put)('agents/:id/approve'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "approveAgent", null);
__decorate([
    (0, common_1.Put)('agents/:id/reject'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('reason')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "rejectAgent", null);
__decorate([
    (0, common_1.Put)('universities/:id/approve'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "approveUniversity", null);
__decorate([
    (0, common_1.Put)('universities/:id/reject'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('reason')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "rejectUniversity", null);
__decorate([
    (0, common_1.Get)('agents'),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getAllAgents", null);
__decorate([
    (0, common_1.Delete)('agents/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "deleteAgent", null);
__decorate([
    (0, common_1.Get)('universities'),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getAllUniversities", null);
__decorate([
    (0, common_1.Delete)('universities/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "deleteUniversity", null);
__decorate([
    (0, common_1.Get)('students'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getAllStudents", null);
__decorate([
    (0, common_1.Delete)('students/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "deleteStudent", null);
__decorate([
    (0, common_1.Get)('applications'),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getAllApplications", null);
__decorate([
    (0, common_1.Get)('applications/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getApplication", null);
__decorate([
    (0, common_1.Put)('applications/:id/approve'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "approveApplication", null);
__decorate([
    (0, common_1.Put)('applications/:id/reject'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)('reason')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "rejectApplication", null);
__decorate([
    (0, common_1.Put)('applications/:id/send-to-university'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "sendToUniversity", null);
__decorate([
    (0, common_1.Post)('applications/:id/notify'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "notifyCandidate", null);
__decorate([
    (0, common_1.Get)('applications/:id/email-template/:type'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('type')),
    __param(2, (0, common_1.Query)('candidateName')),
    __param(3, (0, common_1.Query)('universityName')),
    __param(4, (0, common_1.Query)('program')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getEmailTemplate", null);
__decorate([
    (0, common_1.Post)('broadcast-email'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "broadcastEmail", null);
__decorate([
    (0, common_1.Post)('custom-bulk-email'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "sendCustomBulkEmail", null);
__decorate([
    (0, common_1.Post)('migrate/university-ids'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "migrateUniversityIds", null);
__decorate([
    (0, common_1.Get)('debug/university-id-map'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getUniversityIdMap", null);
__decorate([
    (0, common_1.Get)('university-replies'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getUniversityReplies", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)('admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map