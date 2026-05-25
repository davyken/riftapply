import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  Request,
  UploadedFiles,
  UseInterceptors,
  Put,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApplicationsService } from './applications.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { multerOptions } from '../common/multer.config';

@Controller('applications')
@UseGuards(JwtAuthGuard)
export class ApplicationsController {
  constructor(private applicationsService: ApplicationsService) {}

  @Post()
  @Roles('student', 'agent')
  @UseGuards(RolesGuard)
  @UseInterceptors(FilesInterceptor('documents', 10, multerOptions))
  createApplication(
    @Request() req: any,
    @Body() body: any,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.applicationsService.createApplication(
      {
        id: req.user._id,
        type: req.user.role,
        name: `${req.user.firstName} ${req.user.lastName}`,
        email: req.user.email,
        phone: req.user.phone,
      },
      body,
      files || [],
    );
  }

  @Get('mine')
  @Roles('student', 'agent')
  @UseGuards(RolesGuard)
  getMyApplications(@Request() req: any) {
    return this.applicationsService.findMyApplications(req.user._id);
  }

  @Get('university')
  @Roles('university')
  @UseGuards(RolesGuard)
  getUniversityApplications(@Request() req: any) {
    return this.applicationsService.findByUniversity(req.user._id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.applicationsService.findOne(id);
  }

  @Put(':id/respond')
  @Roles('university')
  @UseGuards(RolesGuard)
  universityRespond(
    @Param('id') id: string,
    @Request() req: any,
    @Body() body: { decision: 'accepted' | 'refused' | 'info_requested'; response: string },
  ) {
    return this.applicationsService.universityRespond(id, req.user._id, body.decision, body.response);
  }
}
