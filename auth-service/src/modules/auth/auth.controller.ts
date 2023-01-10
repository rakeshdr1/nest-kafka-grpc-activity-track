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

  @GrpcMethod('AppController', 'Accumulate')
  accumulate(numberArray: INumberArray): ISumOfNumberArray {
    console.log('accumulate', numberArray);
    const sum = (numberArray.data || []).reduce((a, b) => a + b);
    return { sum };
  }

  @MessagePattern(CONSTANTS.KAFKA_TOPICS.AUTH.SIGN_UP)
  async signUp(@Payload(new ParseMessagePipe()) data: SignUpRequest) {
    return this.authService.signUp(data);
  }

  @MessagePattern(CONSTANTS.KAFKA_TOPICS.AUTH.SIGN_IN)
  async signIn(@Payload(new ParseMessagePipe()) data: SignInRequest) {
    return this.authService.signIn(data);
  }

  @MessagePattern(CONSTANTS.KAFKA_TOPICS.AUTH.VERIFY_TOKEN)
  async verifyToken(@Payload(new ParseMessagePipe()) accessToken: string) {
    return this.authService.verifyAccessToken(accessToken);
  }

  @MessagePattern(CONSTANTS.KAFKA_TOPICS.AUTH.UPDATE_TOKEN)
  async updateToken(@Payload(new ParseMessagePipe()) refreshToken: string) {
    return this.authService.updateAccessToken(refreshToken);
  }
}
