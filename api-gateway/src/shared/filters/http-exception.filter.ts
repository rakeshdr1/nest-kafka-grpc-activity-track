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
        try {
          const formattedError = JSON.parse(exception.details);
          return response.json({
            status: 'error',
            message: formattedError.error,
            statusCode: formattedError.statusCode,
          });
        } catch (err) {
          response.json({ status: 'error', message: exception.details });
        }
      }
    }


    response.json(exception.response);
  }
}
