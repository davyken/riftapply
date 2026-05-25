import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AgentsModule } from './agents/agents.module';
import { UniversitiesModule } from './universities/universities.module';
import { ApplicationsModule } from './applications/applications.module';
import { AdminModule } from './admin/admin.module';
import { NotificationsModule } from './notifications/notifications.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    // MongoDB with explicit connection pool (100 connections handles ~500 concurrent requests)
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI'),
        maxPoolSize: 100,       // max simultaneous DB connections
        minPoolSize: 5,         // keep 5 warm connections ready
        serverSelectionTimeoutMS: 5000,  // fail fast if DB is unreachable
        socketTimeoutMS: 45000,          // drop idle sockets after 45s
        connectTimeoutMS: 10000,
      }),
    }),

    // Rate limiting: 100 requests per 60 seconds per IP (global default)
    // Stricter limits can be applied per-route with @Throttle()
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60000,   // 60 seconds window
        limit: 100,   // max 100 requests per window per IP
      },
      {
        name: 'auth',
        ttl: 60000,
        limit: 10,    // auth endpoints: only 10 attempts per minute
      },
    ]),

    AuthModule,
    UsersModule,
    AgentsModule,
    UniversitiesModule,
    ApplicationsModule,
    AdminModule,
    NotificationsModule,
    CloudinaryModule,
    MailModule,
  ],
  providers: [
    // Apply rate limiting globally to every route
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
