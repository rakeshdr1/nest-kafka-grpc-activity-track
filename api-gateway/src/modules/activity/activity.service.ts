import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { CONSTANTS } from 'src/shared/constants';
import { CreateActivityRequest } from 'src/shared/dto/activity/create-activity.dto';
import { UpdateActivityRequest } from 'src/shared/dto/activity/update-activity.dto';
import HttpCreatedResponse from 'src/shared/http/created-response';
import HttpOkResponse from 'src/shared/http/ok-response';

@Injectable()
export class ActivityService {
  constructor(
    @Inject('Activity-SERVICE')
    private readonly activityService: ClientKafka,
  ) {}

  async findAllByUser(userId: string) {
    const activities = await firstValueFrom(
      this.activityService.send(
        CONSTANTS.KAFKA_TOPICS.ACTIVITY.FIND_ALL,
        userId,
      ),
    );

    return new HttpOkResponse(activities);
  }

  async create(data: CreateActivityRequest) {
    this.activityService.emit(
      CONSTANTS.KAFKA_TOPICS.ACTIVITY.CREATE,
      JSON.stringify(data),
    );

    return new HttpCreatedResponse();
  }

  async update(data: UpdateActivityRequest) {
    await firstValueFrom(
      this.activityService.send(
        CONSTANTS.KAFKA_TOPICS.ACTIVITY.FIND_ONE,
        data.id,
      ),
    );

    this.activityService.emit(
      CONSTANTS.KAFKA_TOPICS.ACTIVITY.UPDATE,
      JSON.stringify(data),
    );

    return new HttpOkResponse();
  }

  async remove(id: string) {
    await firstValueFrom(
      this.activityService.send(CONSTANTS.KAFKA_TOPICS.ACTIVITY.FIND_ONE, id),
    );

    this.activityService.emit(CONSTANTS.KAFKA_TOPICS.ACTIVITY.REMOVE, id);

    return new HttpOkResponse();
  }
}
