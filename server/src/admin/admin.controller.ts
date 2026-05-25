import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('stats')
  getStats() {
    return this.adminService.getDashboardStats();
  }

  // ─── Account Verifications ────────────────────────────────────────
  @Get('pending/agents')
  getPendingAgents() {
    return this.adminService.getPendingAgents();
  }

  @Get('pending/universities')
  getPendingUniversities() {
    return this.adminService.getPendingUniversities();
  }

  @Put('agents/:id/approve')
  approveAgent(@Param('id') id: string) {
    return this.adminService.approveAgent(id);
  }

  @Put('agents/:id/reject')
  rejectAgent(@Param('id') id: string, @Body('reason') reason: string) {
    return this.adminService.rejectAgent(id, reason);
  }

  @Put('universities/:id/approve')
  approveUniversity(@Param('id') id: string) {
    return this.adminService.approveUniversity(id);
  }

  @Put('universities/:id/reject')
  rejectUniversity(@Param('id') id: string, @Body('reason') reason: string) {
    return this.adminService.rejectUniversity(id, reason);
  }

  @Get('agents')
  getAllAgents(@Query('status') status?: string) {
    return this.adminService.getAllAgents(status);
  }

  @Delete('agents/:id')
  deleteAgent(@Param('id') id: string) {
    return this.adminService.deleteAgent(id);
  }

  @Get('universities')
  getAllUniversities(@Query('status') status?: string) {
    return this.adminService.getAllUniversities(status);
  }

  @Delete('universities/:id')
  deleteUniversity(@Param('id') id: string) {
    return this.adminService.deleteUniversity(id);
  }

  @Get('students')
  getAllStudents() {
    return this.adminService.getAllStudents();
  }

  @Delete('students/:id')
  deleteStudent(@Param('id') id: string) {
    return this.adminService.deleteStudent(id);
  }

  // ─── Applications ─────────────────────────────────────────────────
  @Get('applications')
  getAllApplications(@Query('status') status?: string) {
    return this.adminService.getAllApplications(status);
  }

  @Get('applications/:id')
  getApplication(@Param('id') id: string) {
    return this.adminService.getApplicationById(id);
  }

  @Put('applications/:id/approve')
  approveApplication(@Param('id') id: string, @Request() req: any) {
    return this.adminService.approveApplication(id, req.user._id);
  }

  @Put('applications/:id/reject')
  rejectApplication(
    @Param('id') id: string,
    @Request() req: any,
    @Body('reason') reason: string,
  ) {
    return this.adminService.rejectApplication(id, req.user._id, reason);
  }

  @Put('applications/:id/send-to-university')
  sendToUniversity(@Param('id') id: string, @Request() req: any) {
    return this.adminService.sendToUniversity(id, req.user._id);
  }

  // ─── Notify Candidates ────────────────────────────────────────────
  @Post('applications/:id/notify')
  notifyCandidate(
    @Param('id') id: string,
    @Request() req: any,
    @Body()
    body: {
      sendEmail: boolean;
      emailSubject?: string;
      emailBody?: string;
      sendDashboard?: boolean;
    },
  ) {
    return this.adminService.notifyCandidate(id, req.user._id, body);
  }

  @Get('applications/:id/email-template/:type')
  getEmailTemplate(
    @Param('id') id: string,
    @Param('type') type: 'acceptance' | 'rejection' | 'waiting',
    @Query('candidateName') candidateName: string,
    @Query('universityName') universityName: string,
    @Query('program') program: string,
  ) {
    if (type === 'acceptance') {
      return this.adminService.buildAcceptanceEmailTemplate(candidateName, universityName, program);
    } else if (type === 'rejection') {
      return this.adminService.buildRejectionEmailTemplate(candidateName, universityName);
    }
    return this.adminService.buildWaitingEmailTemplate(candidateName, universityName);
  }

  // ─── Migrations ───────────────────────────────────────────────────
  @Post('migrate/university-ids')
  migrateUniversityIds() {
    return this.adminService.migrateUniversityIds();
  }

  // ─── Debug ────────────────────────────────────────────────────────
  @Get('debug/university-id-map')
  getUniversityIdMap() {
    return this.adminService.getUniversityIdMap();
  }

  // ─── University Replies ───────────────────────────────────────────
  @Get('university-replies')
  getUniversityReplies() {
    return this.adminService.getUniversityReplies();
  }
}
