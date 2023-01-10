import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CONSTANTS } from '@shared/constants';
import { CreateActivityRequest } from '@shared/dto/activity/create-activity.dto';
import { UpdateActivityRequest } from '@shared/dto/activity/update-activity.dto';
import { User } from '../auth/decorators/user.decorator';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { ActivityService } from './activity.service';

@Controller('activity')
@ApiTags('Activity')
@ApiBearerAuth()
export class ActivityController {
  constructor(
    @Inject('Activity-SERVICE') private readonly activityClient: ClientKafka,
    private readonly activityService: ActivityService,
  ) {}

  onModuleInit() {
    for (const topic in CONSTANTS.KAFKA_TOPICS.ACTIVITY) {
      this.activityClient.subscribeToResponseOf(
        CONSTANTS.KAFKA_TOPICS.ACTIVITY[topic],
      );
    }
  }

  @Get()
  async findAllByUser(@User() userId: string) {
    return this.activityService.findAllByUser(userId);
  }

  @Post()
  async create(@User() userId: string, @Body() data: CreateActivityRequest) {
    return this.activityService.create({ ...data, user: userId });
  }

  @Patch()
  @UseGuards(JwtGuard)
  async update(@Body() data: UpdateActivityRequest) {
    return this.activityService.update(data);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  async remove(@Param('id') id: string) {
    return this.activityService.remove(id);
  }
}
