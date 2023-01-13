import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

import { CONSTANTS } from '@shared/constants';
import { ParseMessagePipe } from '@shared/pipes/parse-message.pipe';

import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @EventPattern(CONSTANTS.KAFKA_TOPICS.USER.USER_CREATED)
  async notifyUserCreated(@Payload(new ParseMessagePipe()) data) {
    return this.mailService.sendUserRegisteredEmail(data.email, data.name);
  }
}
