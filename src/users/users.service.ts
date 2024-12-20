import {
  BadGatewayException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { User } from './schema/user.schema';
import { IUser } from './user.interface';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  getAllUsers() {
    return this.userModel.find();
  }

  async getUserById(id): Promise<IUser | {}> {
    if (!isValidObjectId(id))
      throw new BadGatewayException('Not valid id is provided');
    const user = (await this.userModel.findById(id));
    return user || {};
  }

  async createUser(body) {
    const existUser = await this.userModel.findOne({
      email: body.email,
    });
    if (existUser) throw new BadGatewayException('user already exists');
    const user = await this.userModel.create(body);
    return user;
  }

  async deleteUser(id) {
    if (!isValidObjectId(id))
      throw new BadGatewayException('Not valid id is provided');
    const user = await this.userModel.findByIdAndDelete(id);
    return { message: 'user deleted', data: user };
  }

  async updateUser(id, body) {
    if (!isValidObjectId(id))
      throw new BadGatewayException('Not valid id is provided');
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      body,
      { new: true },
    );
    return { message: 'user updated successfully', data: updatedUser };
  }
}
