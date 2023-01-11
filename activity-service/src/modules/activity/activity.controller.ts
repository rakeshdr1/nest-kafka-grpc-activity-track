import { Controller } from '@nestjs/common';
import { EventPattern, GrpcMethod, Payload } from '@nestjs/microservices';

import { CONSTANTS } from 'src/shared/constants';
import { CreateActivityRequest } from 'src/shared/dto/activity/create-activity.dto';
import { UpdateActivityRequest } from 'src/shared/dto/activity/update-activity.dto';
import { ParseMessagePipe } from 'src/shared/pipes/parse-message.pipe';
import { ActivityService } from './activity.service';

@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @EventPattern(CONSTANTS.KAFKA_TOPICS.ACTIVITY.CREATE)
  async create(@Payload(new ParseMessagePipe()) data: CreateActivityRequest) {
    this.activityService.create(data);
  }

  @GrpcMethod('ActivityController', 'findAllByUser')
  async findAllByUser(userIdData) {
    return this.activityService.findAllByUser(userIdData.id);
  }

  @GrpcMethod('ActivityController', 'findById')
  async findById(idData) {
    return this.activityService.findById(idData.id);
  }

  @EventPattern(CONSTANTS.KAFKA_TOPICS.ACTIVITY.UPDATE)
  async update(@Payload(new ParseMessagePipe()) data: UpdateActivityRequest) {
    return JSON.stringify(await this.activityService.update(data));
  }

  @EventPattern(CONSTANTS.KAFKA_TOPICS.ACTIVITY.REMOVE)
  async remove(@Payload(new ParseMessagePipe()) id: string) {
    return JSON.stringify(await this.activityService.remove(id));
  }
}
