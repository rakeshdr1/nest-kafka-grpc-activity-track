import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ClientKafka, RpcException } from '@nestjs/microservices';

import * as bcrypt from 'bcryptjs';

import { TokensResponse } from 'src/shared/dto/auth/token-response.dto';
import { UserService } from '../user/user.service';
import { User } from 'src/shared/schemas/user.schema';
import { SignInRequest } from 'src/shared/dto/auth/sign-in.dto';
import { SignUpRequest } from 'src/shared/dto/auth/sign-up.dto';
import { CONSTANTS } from 'src/shared/constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject('NOTIFICATION_SERVICE')
    private readonly notificationClient: ClientKafka,
  ) {}

  async signUp(data: SignUpRequest): Promise<TokensResponse> {
    const userData = await this.userService.findOneByEmail(data.email);

    if (userData) throw new RpcException('User already exists');

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

    if (!user) throw new RpcException('User does not exist');

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) throw new RpcException('Incorrect password');

    return user;
  }

  async verifyAccessToken(accessToken: string) {
    try {
      const payload = this.jwtService.verify(accessToken, {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
      });

      const user = await this.userService.findOne(payload.id);
      if (!user) {
        throw new RpcException('User does not exist');
      }

      if (
        user.lastLoginTime.getTime() > new Date(payload.loginTime).getTime()
      ) {
        throw new RpcException('Device Session Expired');
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
