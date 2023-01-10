import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';

import { CONSTANTS } from '@shared/constants';
import { CreateActivityRequest } from '@shared/dto/activity/create-activity.dto';
import { UpdateActivityRequest } from '@shared/dto/activity/update-activity.dto';
import { ParseMessagePipe } from '@shared/pipes/parse-message.pipe';
import { ActivityService } from './activity.service';

@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @EventPattern(CONSTANTS.KAFKA_TOPICS.ACTIVITY.CREATE)
  async create(@Payload(new ParseMessagePipe()) data: CreateActivityRequest) {
    this.activityService.create(data);
  }

  @MessagePattern(CONSTANTS.KAFKA_TOPICS.ACTIVITY.FIND_ALL)
  async findAllByUser(@Payload(new ParseMessagePipe()) userId: string) {
    return this.activityService.findAllByUser(userId);
  }

  @MessagePattern(CONSTANTS.KAFKA_TOPICS.ACTIVITY.FIND_ONE)
  async findById(@Payload(new ParseMessagePipe()) id: string) {
    return this.activityService.findById(id);
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
