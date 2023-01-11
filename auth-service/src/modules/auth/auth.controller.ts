import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { SignInRequest } from 'src/shared/dto/auth/sign-in.dto';
import { SignUpRequest } from 'src/shared/dto/auth/sign-up.dto';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @GrpcMethod('AuthController', 'create')
  async signUp(data: SignUpRequest) {
    return this.authService.signUp(data);
  }

  @GrpcMethod('AuthController', 'signIn')
  async signIn(data: SignInRequest) {
    return this.authService.signIn(data);
  }

  @GrpcMethod('AuthController', 'verifyToken')
  async verifyToken(accessTokenData: { accessToken: string }) {
    return this.authService.verifyAccessToken(accessTokenData.accessToken);
  }
}
