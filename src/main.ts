import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe ,LogLevel} from '@nestjs/common';
import { setupSwagger } from './swagger/swagger.setup';
import * as express from 'express';
import * as path from 'path';

async function bootstrap() {
  const logLevels: LogLevel[] = ['error', 'warn', 'log'];

  const app = await NestFactory.create(AppModule, {
    rawBody: true,
    bodyParser: true,
    logger: logLevels,
  });

  // Good practice to version API Global Prefix:
  app.setGlobalPrefix('api/v1');

  app.enableCors({
    origin: ['http://localhost:5173','https://rappio-tv.netlify.app','*'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

// 2. Static File Serving (for /uploads)
  // Get the underlying Express instance and use its static middleware
  app.use(
    '/uploads',
    express.static(path.join(process.cwd(), 'uploads')),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      skipUndefinedProperties: true,
    }),
  );


  setupSwagger(app);
  await app.listen(process.env.PORT ?? 3000);
  const port = process.env.PORT ?? 3000;

  // Custom log with port URL
  const hostname = 'localhost'; // Use '0.0.0.0' for deployment
  const url = `http://${hostname}:${port}`;
  console.log(`🚀 Application is running on: ${url}`);
}

bootstrap();
