import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { SignInRequest } from '@shared/dto/auth/sign-in.dto';
import { SignUpRequest } from '@shared/dto/auth/sign-up.dto';
import HttpOkResponse from '@shared/http/ok-response';

import { AuthService } from './auth.service';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
