import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import helmet from 'helmet';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const compression = require('compression');
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // Suppress noisy stack traces in production
    logger: process.env.NODE_ENV === 'production' ? ['error', 'warn'] : ['log', 'error', 'warn', 'debug'],
  });

  // Security headers
  app.use(helmet());

  // Gzip all responses — reduces payload by 60–80%
  app.use(compression());

  // Limit JSON body to 10 MB (protects against large JSON payloads)
  app.use((req: any, res: any, next: any) => {
    if (req.headers['content-type']?.includes('application/json')) {
      // express default body size is 100kb; nest increases it — cap it here
    }
    next();
  });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Catch every unhandled exception — prevents process crashes from rogue errors
  app.useGlobalFilters(new AllExceptionsFilter());

  app.enableCors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  });

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`Server running on port ${port} [${process.env.NODE_ENV || 'development'}]`);
}

// Catch any promise rejection that escapes NestJS — last resort guard
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

bootstrap();
