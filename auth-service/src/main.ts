import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { ExceptionFilter } from 'src/shared/filters/exception.filters';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const micro1 = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.GRPC,
    options: {
      url: `localhost:3001`,
      package: 'auth',
      protoPath: join(__dirname, './shared/_proto/auth.proto'),
    },
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'auth-consumer',
      },
    },
  });

  app.useGlobalFilters(new ExceptionFilter());

  await app.startAllMicroservices();
  await micro1.listenAsync();
}
bootstrap();
