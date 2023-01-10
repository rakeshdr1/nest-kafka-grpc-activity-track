import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { AuthModule } from '../auth/auth.module';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'Activity-SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'activity-service',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'activity-consumer',
          },
        },
      },
    ]),
    AuthModule,
  ],
  controllers: [ActivityController],
  providers: [ActivityService],
})
export class ActivityModule {}
