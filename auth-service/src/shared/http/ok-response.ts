import { HttpStatus } from '@nestjs/common';

import { Success } from './message';
import HttpResponse from './response';

export default class HttpOkResponse extends HttpResponse {
  constructor(data?: any) {
    super(data, HttpStatus.OK, Success);
  }
}
