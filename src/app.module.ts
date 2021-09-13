import { LoggerModule } from 'nestjs-pino';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        wrapSerializers: false,
        serializers: {
          req(req) {
            return {
              method: req.method,
              url: req.url,
              query: req.query,
              params: req.params,
              headers: {
                host: req.headers.host,
                userAgent: req.headers['user-agent'],
              },
              remoteAddress: `${
                req.headers['x-forwarded-for'] || req.socket.remoteAddress
              }`,
            };
          },
          res(res) {
            return {
              status: res.statusCode,
            };
          },
          responseTime(responseTime) {
            return `${responseTime}ms`;
          },
        },
        customLogLevel: function (res, err) {
          if (res.statusCode >= 400 && res.statusCode < 500) {
            return 'warn';
          } else if (res.statusCode >= 500 || err) {
            return 'error';
          }
          return 'info';
        },
        customSuccessMessage: function (res) {
          if (res.statusCode === 404) {
            return 'resource not found';
          }
          return 'request completed';
        },
        customErrorMessage: function (error, res) {
          return 'request errored with status code: ' + res.statusCode;
        },
        prettyPrint: {
          colorize: true,
          levelFirst: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      },
    }),
    TypeOrmModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
