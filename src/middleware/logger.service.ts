import * as moment from 'moment';
import * as winston from 'winston';

import { LoggerService as LS } from '@nestjs/common';

const { colorize, combine, printf } = winston.format;

export class LoggerService implements LS {
  private logger: winston.Logger;

  private logLevels: winston.config.AbstractConfigSetLevels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 5,
  };

  private logColors: winston.config.AbstractConfigSetColors = {
    error: 'red',
    warn: 'yellow',
    http: 'green',
    info: 'cyan',
    debug: 'blue',
  };

  constructor() {
    winston.addColors(this.logColors);

    const timeStamp = () => moment().format('YYYY-MM-DD HH:mm:ss');

    const loggingFormat = printf(({ level, message }) => {
      if (typeof message === 'object') {
        message = JSON.stringify(message, null, 2);
      }
      return `${timeStamp()} ${level} : ${message}`;
    });

    this.logger = winston.createLogger({
      levels: this.logLevels,
      transports: [
        new winston.transports.File({
          level: 'http',
          filename: `${moment(new Date()).format('YYYY-MM-DD')}.log`,
          dirname: 'log',
          maxsize: 5000000,
        }),
        new winston.transports.Console({
          level: 'debug',
          format: combine(colorize(), loggingFormat),
        }),
      ],
    });

    console.log = (message: any, params?: any) => {
      this.logger.debug(message, params);
    };
  }

  error(message: string, trace: string) {
    this.logger.error(message, trace);
  }
  warn(message: string) {
    this.logger.warn(message);
  }
  http(message: string) {
    this.logger.http(message);
  }
  info(message: string) {
    this.logger.info(message);
  }
  debug(message: string) {
    this.logger.debug(message);
  }
  log(message: string) {
    this.logger.info(message);
  }
}
