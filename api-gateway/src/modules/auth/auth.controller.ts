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

import { CONSTANTS } from '@shared/constants';
import { SignInRequest } from '@shared/dto/auth/sign-in.dto';
import { SignUpRequest } from '@shared/dto/auth/sign-up.dto';
import HttpOkResponse from '@shared/http/ok-response';

import { AuthService } from './auth.service';

@Controller('auth')
@ApiTags('Auth')
export class AuthController implements OnModuleInit {
  constructor(
    @Inject('AUTH-SERVICE') private readonly authClient: ClientKafka,
    private readonly authService: AuthService,
  ) {}

  onModuleInit() {
    for (const topic in CONSTANTS.KAFKA_TOPICS.AUTH) {
      this.authClient.subscribeToResponseOf(CONSTANTS.KAFKA_TOPICS.AUTH[topic]);
    }
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
