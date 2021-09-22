import * as dotenv from 'dotenv';
import * as moment from 'moment';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import * as winston from 'winston';

import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { ISwaggerConfig } from './swagger/interface';

export class ConfigService {
  constructor() {
    dotenv.config({
      path:
        process.env.NODE_ENV === 'development'
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
      type: 'postgres',
      host: this.get('DATABASE_HOST'),
      port: this.getNumber('DATABASE_PORT'),
      username: this.get('DATABASE_USERNAME'),
      password: this.get('DATABASE_PASSWORD'),
      database: this.get('DATABASE_DATABASE'),
      entities: [__dirname + '/../**/*.entity.js'],
      namingStrategy: new SnakeNamingStrategy(),
      keepConnectionAlive: true,
      logging: ['error'],
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
        new File({
          level: 'http',
          filename: `${moment(new Date()).format('YYYY-MM-DD')}.log`,
          dirname: 'log',
          maxsize: 5000000,
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
}
