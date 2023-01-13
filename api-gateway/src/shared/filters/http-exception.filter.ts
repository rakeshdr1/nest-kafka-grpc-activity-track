import {
  Catch,
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    if (!(exception instanceof HttpException)) {
      if (exception.details) {
        const formattedError = JSON.parse(exception.details);
        return response.json({
          status: 'error',
          message: formattedError.error,
          statusCode: formattedError.statusCode,
        });
      }
    }

    response.json(exception.response);
  }
}
