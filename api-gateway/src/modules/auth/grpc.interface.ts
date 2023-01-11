import { SignInRequest } from '@shared/dto/auth/sign-in.dto';
import { SignUpRequest } from '@shared/dto/auth/sign-up.dto';
import { Observable } from 'rxjs';

export interface IGrpcService {
  verifyToken(token: { accessToken: string }): Observable<any>;

  signIn(
    data: SignInRequest,
  ): Observable<{ accessToken: string; refreshToken: string }>;

  create(
    data: SignUpRequest,
  ): Observable<{ accessToken: string; refreshToken: string }>;
}
