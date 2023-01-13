import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as grpc from '@grpc/grpc-js';

import { CreateActivityRequest } from 'src/shared/dto/activity/create-activity.dto';
import { UpdateActivityRequest } from 'src/shared/dto/activity/update-activity.dto';
import { Activity } from 'src/shared/schemas/activity.schema';
import { ResponseHandlerService } from '@shared/handlers/response-handlers';

const GrpcStatus = grpc.status;

@Injectable()
export class ActivityService {
  constructor(
    @InjectModel(Activity.name)
    private readonly activityModel: Model<Activity>,
    private readonly responseHandlerService: ResponseHandlerService,
  ) {}

  async create(data: CreateActivityRequest) {
    await this.activityModel.create(data);
  }

  async findAllByUser(userId) {
    const activities = await this.activityModel.find({ user: userId });
    return { activities };
  }

  async findById(id: string) {
    const activity = await this.activityModel.findOne({ _id: id });

    if (!activity) {
      return this.responseHandlerService.response(
        'Activity does not exist',
        HttpStatus.NOT_FOUND,
        GrpcStatus.NOT_FOUND,
        null,
      );
    }
    return activity;
  }

  async update(data: UpdateActivityRequest) {
    await this.activityModel.updateOne({ _id: data.id }, { ...data });
  }

  async remove(id: string) {
    await this.activityModel.deleteOne({ _id: id });
  }
}
