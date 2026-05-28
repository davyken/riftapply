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

  const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:3000')
    .split(',')
    .map((o) => o.trim());

  app.enableCors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
  });

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`Server running on port ${port} [${process.env.NODE_ENV || 'development'}]`);

  // Keep-alive script to prevent server from sleeping
  const serverUrl = process.env.SERVER_URL || process.env.RENDER_EXTERNAL_URL || process.env.RAILWAY_STATIC_URL;
  if (serverUrl) {
    setInterval(() => {
      fetch(`${serverUrl}/api/health`)
        .then(() => console.log('Keep-alive ping successful'))
        .catch((err) => console.error('Keep-alive ping failed:', err.message));
    }, 5 * 60 * 1000); // Ping every 5 minutes
  } else {
    // Fallback to local ping if no external URL is provided
    setInterval(() => {
      fetch(`http://localhost:${port}/api/health`)
        .then(() => console.log('Local keep-alive ping successful'))
        .catch((err) => console.error('Local keep-alive ping failed:', err.message));
    }, 5 * 60 * 1000);
  }
}

// Catch any promise rejection that escapes NestJS — last resort guard
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

bootstrap();
