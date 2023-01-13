import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ClientKafka, RpcException } from '@nestjs/microservices';
import * as grpc from '@grpc/grpc-js';
import * as bcrypt from 'bcryptjs';

import { TokensResponse } from '@shared/dto/auth/token-response.dto';
import { User } from '@shared/schemas/user.schema';
import { SignInRequest } from '@shared/dto/auth/sign-in.dto';
import { SignUpRequest } from '@shared/dto/auth/sign-up.dto';
import { CONSTANTS } from '@shared/constants';
import { ResponseHandlerService } from '@shared/handlers/response-handlers';

import { UserService } from '../user/user.service';

const GrpcStatus = grpc.status;

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject('NOTIFICATION_SERVICE')
    private readonly notificationClient: ClientKafka,
    private readonly responseHandlerService: ResponseHandlerService,
  ) {}

  async signUp(data: SignUpRequest): Promise<TokensResponse> {
    const userData = await this.userService.findOneByEmail(data.email);

    if (userData) {
      return this.responseHandlerService.response(
        'User already exists',
        HttpStatus.CONFLICT,
        GrpcStatus.ALREADY_EXISTS,
        null,
      );
    }

    const hashedPassword = await bcrypt.hash(data.password, 7);
    const user = await this.userService.create({
      ...data,
      password: hashedPassword,
    });

    this.notificationClient.emit(
      CONSTANTS.KAFKA_TOPICS.USER.USER_CREATED,
      JSON.stringify(data),
    );

    const tokens = await this.generateTokens(user);
    return tokens;
  }

  async signIn(data: SignInRequest): Promise<TokensResponse> {
    const user = await this.verifyUser(data.email, data.password);

    const tokens = await this.generateTokens(user);

    return tokens;
  }

  async verifyUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      return this.responseHandlerService.response(
        'User does not exist',
        HttpStatus.NOT_FOUND,
        GrpcStatus.NOT_FOUND,
        null,
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return this.responseHandlerService.response(
        'Incorrect password',
        HttpStatus.UNAUTHORIZED,
        GrpcStatus.UNAUTHENTICATED,
        null,
      );
    }

    return user;
  }

  async verifyAccessToken(accessToken: string) {
    try {
      const payload = this.jwtService.verify(accessToken, {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
      });

      const user = await this.userService.findOne(payload.id);
      if (!user) {
        return this.responseHandlerService.response(
          'User does not exist',
          HttpStatus.NOT_FOUND,
          GrpcStatus.NOT_FOUND,
          null,
        );
      }

      if (
        user.lastLoginTime.getTime() > new Date(payload.loginTime).getTime()
      ) {
        return this.responseHandlerService.response(
          'Device Session Expired',
          HttpStatus.UNAUTHORIZED,
          GrpcStatus.UNAUTHENTICATED,
          null,
        );
      }

      return { id: payload.id };
    } catch (err) {
      throw new RpcException(err.message);
    }
  }

  private async generateTokens(user: User): Promise<TokensResponse> {
    const { _id } = user;
    const loginTime = new Date();
    const payload = { id: _id, loginTime };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_EXPIRE'),
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRE'),
    });

    const tokens = { accessToken, refreshToken };
    user.lastLoginTime = loginTime;
    await user.save();

    return tokens;
  }
}
