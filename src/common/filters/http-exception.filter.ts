import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';

@Catch()
export default class CatchException implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const context: HttpArgumentsHost = host.switchToHttp();
    const response = context.getResponse();

    let httpError;

    if (exception instanceof HttpException) {
      httpError = {
        status: exception.getStatus(),
        message: exception.message,
        validation: exception.getResponse()['validation'],
      };
    } else {
      httpError = {
        status: 500,
        message: '서버 오류입니다.',
      };
    }

    Logger.error({
      ...httpError,
      name: exception.name,
    });

    const { status, message, validation } = httpError;
    return response.status(status).json({
      status,
      message,
      validation,
    });
  }
}
