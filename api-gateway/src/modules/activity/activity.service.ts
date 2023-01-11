import { Inject, Injectable } from '@nestjs/common';
import { Client, ClientGrpc, ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { CONSTANTS } from 'src/shared/constants';
import { CreateActivityRequest } from 'src/shared/dto/activity/create-activity.dto';
import { UpdateActivityRequest } from 'src/shared/dto/activity/update-activity.dto';
import HttpCreatedResponse from 'src/shared/http/created-response';
import HttpOkResponse from 'src/shared/http/ok-response';
import { IGrpcService } from './grpc.interface';
import { microserviceOptions } from './grpc.options';

@Injectable()
export class ActivityService {
  @Client(microserviceOptions)
  private client: ClientGrpc;

  private activityGrpcService: IGrpcService;

  onModuleInit() {
    this.activityGrpcService =
      this.client.getService<IGrpcService>('ActivityController');
  }

  constructor(
    @Inject('Activity-SERVICE')
    private readonly activityService: ClientKafka,
  ) {}

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
