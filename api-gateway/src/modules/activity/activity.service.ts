import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc, ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { CONSTANTS } from '@shared/constants';
import { CreateActivityRequest } from '@shared/dto/activity/create-activity.dto';
import { UpdateActivityRequest } from '@shared/dto/activity/update-activity.dto';
import HttpCreatedResponse from '@shared/http/created-response';
import HttpOkResponse from '@shared/http/ok-response';

import { IGrpcService } from './grpc.interface';

@Injectable()
export class ActivityService {
  private activityGrpcService: IGrpcService;

  constructor(
    @Inject('ACTIVITY_SERVICE')
    private readonly activityService: ClientKafka,
    @Inject('ACTIVITY_GRPC_SERVICE')
    private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.activityGrpcService =
      this.client.getService<IGrpcService>('ActivityController');
  }

  accumulate(data) {
    return this.activityGrpcService.accumulate({ data });
  }

  async findAllByUser(userId: string) {
    return firstValueFrom(
      this.activityGrpcService.findAllByUser({ id: userId }),
    );
  }

  async create(data: CreateActivityRequest) {
    this.activityService.emit(
      CONSTANTS.KAFKA_TOPICS.ACTIVITY.CREATE,
      JSON.stringify(data),
    );

    return new HttpCreatedResponse();
  }

  async update(data: UpdateActivityRequest) {
    await firstValueFrom(this.activityGrpcService.findById({ id: data.id }));

    this.activityService.emit(
      CONSTANTS.KAFKA_TOPICS.ACTIVITY.UPDATE,
      JSON.stringify(data),
    );

    return new HttpOkResponse();
  }

  async remove(id: string) {
    await firstValueFrom(this.activityGrpcService.findById({ id }));

    this.activityService.emit(CONSTANTS.KAFKA_TOPICS.ACTIVITY.REMOVE, id);

    return new HttpOkResponse();
  }
}
