import { Controller } from '@nestjs/common';
import { GrpcMethod, MessagePattern, Payload } from '@nestjs/microservices';

import { CONSTANTS } from 'src/shared/constants';
import { SignInRequest } from 'src/shared/dto/auth/sign-in.dto';
import { SignUpRequest } from 'src/shared/dto/auth/sign-up.dto';
import { ParseMessagePipe } from 'src/shared/pipes/parse-message.pipe';

import { AuthService } from './auth.service';

interface INumberArray {
  data: number[];
}
interface ISumOfNumberArray {
  sum: number;
}

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
