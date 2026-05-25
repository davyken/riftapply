import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryService } from './cloudinary.service';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'CLOUDINARY',
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return cloudinary.config({
          cloud_name: config.get('CLOUDINARY_CLOUD_NAME'),
          api_key: config.get('CLOUDINARY_API_KEY'),
          api_secret: config.get('CLOUDINARY_API_SECRET'),
        });
      },
    },
    CloudinaryService,
  ],
  exports: [CloudinaryService],
})
export class CloudinaryModule {}
