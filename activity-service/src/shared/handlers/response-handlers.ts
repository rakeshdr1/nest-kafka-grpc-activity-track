import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ResponseHandlerService {
  response(error: any, statusCode, GrpcStatusCode, data) {
    const response = {};
    if (error) {
      Object.assign(response, {
        code: GrpcStatusCode,
        message: JSON.stringify({
          error: error.toString(),
          statusCode: statusCode,
          stack: error.stack,
        }),
      });
      throw new RpcException(response);
    }

    return data;
  }
}
