import { ClientOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const microserviceOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    package: 'auth',
    url: `localhost:3001`,
    protoPath: join(__dirname, '../../shared/_proto/auth.proto'),
  },
};
