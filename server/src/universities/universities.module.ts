import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { University, UniversitySchema } from './schemas/university.schema';
import { UniversitiesController } from './universities.controller';
import { UniversitiesService } from './universities.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: University.name, schema: UniversitySchema }]),
    CloudinaryModule,
  ],
  controllers: [UniversitiesController],
  providers: [UniversitiesService],
  exports: [MongooseModule, UniversitiesService],
})
export class UniversitiesModule {}
