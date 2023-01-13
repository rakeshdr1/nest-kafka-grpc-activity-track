import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_GRPC_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'auth',
          url: `localhost:5005`,
          protoPath: join(__dirname, '../../shared/_proto/auth.proto'),
        },
      },
      {
        name: 'AUTH-SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'auth-service',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'auth-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
