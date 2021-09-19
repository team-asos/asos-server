import { NextFunction, Request, Response } from 'express';

import { Injectable, NestMiddleware } from '@nestjs/common';

import { LoggerService } from '../utils/logger/logger.service';

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  private logger = new LoggerService();

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, path: url, httpVersion } = request;
    const userAgent = request.get('user-agent') || '';

    response.on('close', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');

      this.logger.http(
        `HTTP/${httpVersion} ${method} ${ip} ${url} ${statusCode} ${contentLength} - ${userAgent}`,
      );
    });

    next();
  }
}
