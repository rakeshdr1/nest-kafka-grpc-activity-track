import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

import { AuthModule } from '../auth/auth.module';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ACTIVITY_GRPC_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'activity',
          url: `localhost:5006`,
          protoPath: join(__dirname, '../../shared/_proto/activity.proto'),
        },
      },
      {
        name: 'ACTIVITY_SERVICE',
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
