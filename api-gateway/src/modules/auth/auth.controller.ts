import {
  Body,
  Controller,
  Inject,
  OnModuleInit,
  Post,
  Res,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { Client, ClientGrpc } from '@nestjs/microservices';
import { IGrpcService } from './grpc.interface';
import { microserviceOptions } from './grpc.options';

import { CONSTANTS } from 'src/shared/constants';
import { SignInRequest } from 'src/shared/dto/auth/sign-in.dto';
import { SignUpRequest } from 'src/shared/dto/auth/sign-up.dto';
import HttpOkResponse from 'src/shared/http/ok-response';

import { AuthService } from './auth.service';

@Controller('auth')
@ApiTags('Auth')
export class AuthController implements OnModuleInit {
  @Client(microserviceOptions)
  private client: ClientGrpc;

  private grpcService: IGrpcService;

  constructor(
    @Inject('AUTH-SERVICE') private readonly authClient: ClientKafka,
    private readonly authService: AuthService,
  ) {}

  onModuleInit() {
    for (const topic in CONSTANTS.KAFKA_TOPICS.AUTH) {
      this.authClient.subscribeToResponseOf(CONSTANTS.KAFKA_TOPICS.AUTH[topic]);
    }
    this.grpcService = this.client.getService<IGrpcService>('AppController');
  }

  @Post()
  accumulate(@Body('data') data: number[]) {
    return this.grpcService.accumulate({ data });
  }

  @Post('signUp')
  async signUp(@Body() data: SignUpRequest) {
    const { accessToken, refreshToken } = await this.authService.signUp(data);

    return new HttpOkResponse({ accessToken, refreshToken });
  }

  @Post('signIn')
  async signIn(@Body() data: SignInRequest) {
    const { accessToken, refreshToken } = await this.authService.signIn(data);

    return new HttpOkResponse({ accessToken, refreshToken });
  }
}
