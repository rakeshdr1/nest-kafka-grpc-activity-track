import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateActivityRequest } from 'src/shared/dto/activity/create-activity.dto';
import { UpdateActivityRequest } from 'src/shared/dto/activity/update-activity.dto';
import { Activity } from 'src/shared/schemas/activity.schema';

@Injectable()
export class ActivityService {
  constructor(
    @InjectModel(Activity.name)
    private readonly activityModel: Model<Activity>,
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

    if (!activity) throw new RpcException('activity does not exist');
    return activity;
  }

  async update(data: UpdateActivityRequest) {
    await this.activityModel.updateOne({ _id: data.id }, { ...data });
  }

  async remove(id: string) {
    await this.activityModel.deleteOne({ _id: id });
  }
}
