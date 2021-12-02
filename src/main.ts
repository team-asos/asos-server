import * as morgan from 'morgan';

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app.module';
import CatchException from './common/filters/http-exception.filter';
import { LoggerService } from './common/utils/logger/logger.service';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { setupSwagger } from './config/swagger/setup';
import { MockModule } from './mock/mock.module';
import { MockService } from './mock/mock.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.select(ConfigModule).get(ConfigService);
  const loggerService = app.select(ConfigModule).get(LoggerService);
  const mockService = app.select(MockModule).get(MockService);

  // CORS
  app.enableCors(configService.corsConfig);

  // Proxy
  app.enable('trust proxy');

  // Validation
  app.useGlobalPipes(new ValidationPipe(configService.validationConfig));

  // Filter
  app.useGlobalFilters(new CatchException());

  // Logger
  app.useLogger(loggerService);
  app.use(
    morgan(
      'HTTP/:http-version :method :remote-addr :url :remote-user :status :res[content-length] :referrer :user-agent :response-time ms',
      {
        skip: req => req.url === '/favicon.ico' || req.url === '/',
        stream: {
          write: message => {
            loggerService.http(message);
          },
        },
      },
    ),
  );

  // Swagger
  if (['development'].includes(configService.env)) {
    setupSwagger(app, configService.swaggerConfig);
  }

  // Dummy
  if (configService.getBoolean('DUMMY_ALLOW')) {
    mockService.dummy();
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
