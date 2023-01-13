import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { SignInRequest } from '@shared/dto/auth/sign-in.dto';
import { User } from '@shared/schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findOne({ id });

    if (!user) throw new RpcException('User does not exist');

    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email });

    return user;
  }

  async create(data: SignInRequest): Promise<User> {
    const user = await this.userModel.create(data);

    return user;
  }
}
