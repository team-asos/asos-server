import * as morgan from 'morgan';

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { LoggerService } from './common/utils/logger/logger.service';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { setupSwagger } from './config/swagger/setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Logger
  const loggerService = app.select(ConfigModule).get(LoggerService);
  app.useLogger(loggerService);
  app.use(
    morgan(
      'HTTP/:http-version :method :remote-addr :url :remote-user :status :res[content-length] :referrer :user-agent :response-time ms',
      {
        stream: {
          write: message => {
            loggerService.http(message);
          },
        },
      },
    ),
  );

  // Swagger
  const configService = app.select(ConfigModule).get(ConfigService);
  if (['development'].includes(configService.env)) {
    setupSwagger(app, configService.swaggerConfig);
  }

  const port = configService.get('PORT');
  const host = configService.get('HOST');
  await app.listen(port, host);

  if (configService.env === 'development') {
    console.log(configService.env);
  }

  loggerService.warn(`server running on port ${host}:${port}`);
}

bootstrap();
