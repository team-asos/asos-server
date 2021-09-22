import { ConfigService } from 'src/config/config.service';
import * as winston from 'winston';

import { ConsoleLogger, Injectable } from '@nestjs/common';

@Injectable()
export class LoggerService extends ConsoleLogger {
  private readonly logger: winston.Logger;

  constructor(private readonly configService: ConfigService) {
    super(LoggerService.name);
    this.logger = winston.createLogger(configService.winstonConfig);

    console.log = (message: any, params?: any) => {
      this.logger.debug(message, params);
    };
  }

  error(message: string, trace?: string): void {
    this.logger.error(message, trace);
  }
  warn(message: string): void {
    this.logger.warn(message);
  }
  info(message: string): void {
    this.logger.info(message);
  }
  http(message: string): void {
    this.logger.http(message);
  }
  debug(message: string): void {
    this.logger.debug(message);
  }
  log(message: string): void {
    this.logger.info(message);
  }
}
