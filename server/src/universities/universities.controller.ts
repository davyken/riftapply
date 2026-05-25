import { Controller, Get, Post, Param, UseGuards, Request, Put, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UniversitiesService } from './universities.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { multerOptions } from '../common/multer.config';

@Controller('universities')
export class UniversitiesController {
  constructor(private universitiesService: UniversitiesService) {}

  @Post('parse-prerequisites')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async parsePrerequisites(
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.universitiesService.parsePrerequisitesPdf(file);
  }

  @Get()
  findAll() {
    return this.universitiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.universitiesService.findOne(id);
  }

  @Put('profile')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('logo', multerOptions))
  updateProfile(
    @Request() req: any,
    @Body() body: any,
    @UploadedFile() logo?: Express.Multer.File,
  ) {
    if (typeof body.modules === 'string') {
      try {
        body.modules = JSON.parse(body.modules);
      } catch (err) {
        // Ignore parsing errors
      }
    }
    if (typeof body.requirements === 'string') {
      try {
        body.requirements = JSON.parse(body.requirements);
      } catch (err) {
        // Ignore parsing errors
      }
    }
    return this.universitiesService.updateProfile(req.user._id, body, logo);
  }
}
