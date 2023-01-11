import { ClientOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const microserviceOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    package: 'activity',
    url: `localhost:5000`,
    protoPath: join(__dirname, '../../shared/_proto/activity.proto'),
  },
};
