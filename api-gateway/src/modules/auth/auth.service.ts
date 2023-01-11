import { Injectable } from '@nestjs/common';
import { Client, ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { SignInRequest } from 'src/shared/dto/auth/sign-in.dto';
import { SignUpRequest } from 'src/shared/dto/auth/sign-up.dto';
import { TokensResponse } from 'src/shared/dto/auth/token-response.dto';
import { IGrpcService } from './grpc.interface';
import { microserviceOptions } from './grpc.options';

@Injectable()
export class AuthService {
  @Client(microserviceOptions)
  private client: ClientGrpc;

  private authService: IGrpcService;

  onModuleInit() {
    this.authService = this.client.getService<IGrpcService>('AuthController');
  }

  async signUp(data: SignUpRequest): Promise<TokensResponse> {
    const tokens = await firstValueFrom(this.authService.create(data));

    return tokens;
  }

  async signIn(data: SignInRequest): Promise<TokensResponse> {
    const tokens = await firstValueFrom(this.authService.signIn(data));

    return tokens;
  }

  async verifyToken(accessToken: string): Promise<string> {
    const data = await firstValueFrom(
      this.authService.verifyToken({ accessToken }),
    );
    return data.id;
  }
}
