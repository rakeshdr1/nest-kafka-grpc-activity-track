import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ResponseHandlerService } from '@shared/handlers/response-handlers';

import { Activity, ActivitySchema } from 'src/shared/schemas/activity.schema';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Activity.name, schema: ActivitySchema },
    ]),
  ],
  controllers: [ActivityController],
  providers: [ActivityService, ResponseHandlerService],
})
export class ActivityModule {}
