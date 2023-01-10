import { HttpStatus } from '@nestjs/common';

import { Success } from './message';
import HttpResponse from './response';

export default class HttpCreatedResponse extends HttpResponse {
  constructor(data?: any) {
    super(data, HttpStatus.CREATED, Success);
  }
}
