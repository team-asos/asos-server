import 'winston-daily-rotate-file';

import * as dotenv from 'dotenv';
import * as moment from 'moment';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import * as winston from 'winston';

import {
  BadRequestException,
  ValidationError,
  ValidationPipeOptions,
} from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { ISwaggerConfig } from './swagger/interface';

export class ConfigService {
  constructor() {
    dotenv.config({
      path:
        process.env.NODE_ENV === 'development' ||
        process.env.NODE_ENV === 'dummy'
          ? '.development.env'
          : '.production.env',
    });
  }

  public get(key: string): string {
    return process.env[key];
  }

  public getNumber(key: string): number {
    return Number(this.get(key));
  }

  public getBoolean(key: string): boolean {
    return JSON.parse(this.get(key));
  }

  get env(): string {
    return this.get('NODE_ENV');
  }

  get swaggerConfig(): ISwaggerConfig {
    return {
      path: this.get('SWAGGER_PATH') || '/api',
      title: this.get('SWAGGER_TITLE') || '',
      description: this.get('SWAGGER_DESCRIPTION'),
      version: this.get('SWAGGER_VERSION') || '',
    };
  }

  get typeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this.get('DATABASE_HOST'),
      port: this.getNumber('DATABASE_PORT'),
      username: this.get('DATABASE_USERNAME'),
      password: this.get('DATABASE_PASSWORD'),
      database: this.get('DATABASE_DATABASE'),
      synchronize: this.getBoolean('DATABASE_SYNCHRONIZE'),
      entities: [__dirname + '/../**/*.entity.js'],
      namingStrategy: new SnakeNamingStrategy(),
      keepConnectionAlive: true,
      logging: ['error'],
      timezone: '+09:00',
    };
  }

  get winstonConfig(): winston.LoggerOptions {
    const { colorize, combine, printf } = winston.format;
    const { File, Console } = winston.transports;

    const logLevels: winston.config.AbstractConfigSetLevels = {
      error: 0,
      warn: 1,
      info: 2,
      http: 3,
      debug: 5,
    };

    const logColors: winston.config.AbstractConfigSetColors = {
      error: 'red',
      warn: 'yellow',
      info: 'cyan',
      http: 'green',
      debug: 'blue',
    };

    winston.addColors(logColors);

    const loggingFormat = printf(({ level, message }) => {
      if (typeof message === 'object') {
        message = JSON.stringify(message, null, 2);
      }
      return `${moment().format('YYYY-MM-DD HH:mm:ss')} ${level} : ${message}`;
    });

    return {
      levels: logLevels,
      transports: [
        new winston.transports.DailyRotateFile({
          filename: '%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          dirname: 'log',
          level: 'http',
          format: combine(loggingFormat),
        }),
        new Console({
          level: 'debug',
          handleExceptions: true,
          format: combine(colorize(), loggingFormat),
        }),
      ],
      exitOnError: false,
    };
  }

  get corsConfig(): CorsOptions {
    const whitelist = this.get('CORS_WHITELIST');

    return {
      origin: (origin, callback) => {
        if (
          !origin ||
          whitelist.indexOf(origin) !== -1 ||
          origin === `http://localhost:${this.get('PORT')}`
        )
          callback(null, true);
        else callback(new Error('Not allowed by CORS'));
      },
      allowedHeaders: [
        'Access-Control-Allow-Headers',
        'Content-Type',
        'Accept',
        'Authorization',
      ],
      methods: ['GET', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
      credentials: true,
    };
  }

  get validationConfig(): ValidationPipeOptions {
    return {
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const messages = errors.map(error => {
          return {
            error: `${error.property} has wrong value ${error.value}.`,
            message: Object.values(error.constraints).join(''),
          };
        });

        return new BadRequestException({ validation: messages });
      },
    };
  }
}
