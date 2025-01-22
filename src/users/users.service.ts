import {
  BadGatewayException,
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { isValidObjectId, Model } from 'mongoose';
import { User } from './schema/user.schema';
import { IUser } from './user.interface';
import { faker } from '@faker-js/faker';
import { QueryParamsDto } from './DTOs/queryParams.dto';
import { QueryParamsAgeDto } from './DTOs/queryParamsAge.dto';
import { Post } from '../post/schema/post.schema';
import { Expense } from '../expenses/schema/expenses.schema';

@Injectable()
export class UsersService implements OnModuleInit {
  async onModuleInit() {
    const users = await this.userModel.countDocuments();
    if (false) {
      const usersList = [];
      for (let i = 0; i < 30000; i++) {
        const user = {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          email: faker.internet.email(),
          phoneNumber: faker.phone.number(),
          gender: faker.person.gender(),
          age: faker.number.int({ min: 0, max: 120 }),
        };
        usersList.push(user);
      }
      await this.userModel.insertMany(usersList);
    }
    // await this.userModel.deleteMany();
  }
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(Expense.name) private expenseModel: Model<Expense>,
  ) {}

  getAllUsers(queryParams: QueryParamsDto) {
    const { page, take } = queryParams;
    const limit = Math.min(take, 50);
    return this.userModel
      .find()
      .skip((page - 1) * take)
      .limit(page * limit);
  }

  async getCountUsers() {
    const users = await this.userModel.countDocuments();
    return users;
  }

  async findOneByEmail(email: string) {
    const user = await this.userModel.findOne({ email });
    return user;
  }

  async getUserById(id): Promise<IUser> {

    if (!isValidObjectId(id))
      throw new BadGatewayException('Not valid id is provided');
    return this.userModel.findById(id);
  }

  async getUsersByAge(age: number, query: QueryParamsAgeDto) {
    const { ageFrom, ageTo } = query;

    const filter =
      ageFrom && ageTo ? { age: { $gte: ageFrom, $lte: ageTo } } : { age };

    return this.userModel.find(filter).limit(100);
  } 

  async createUser(body) {
    const existUser = await this.userModel.findOne({
      email: body.email,
    });
    if (existUser) throw new BadGatewayException('user already exists');
    const user = await this.userModel.create(body);
    return user;
  }

  async deleteUser(id: mongoose.Schema.Types.ObjectId) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await Promise.all([
      this.postModel.deleteMany({ _id: { $in: user.posts } }),
      this.expenseModel.deleteMany({ _id: { $in: user.expenses } }),
    ]);
    const deletedUser = await this.userModel.findByIdAndDelete(id);
    return { message: 'user deleted', data: deletedUser };
  }

  async updateUser(id, body) {
    if (!isValidObjectId(id))
      throw new BadGatewayException('Not valid id is provided');
    const updatedUser = await this.userModel.findByIdAndUpdate(id, body, {
      new: true,
    });
    return { message: 'user updated successfully', data: updatedUser };
  }

  async addExpenseId(id, expenseId) {
    const user = await this.userModel.findById(id);
    if (!user) throw new BadRequestException('user not found');

    const expenses = user.expenses;
    expenses.push(expenseId);

    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      { ...user, expenses },
      {
        new: true,
      },
    );
    return updatedUser;
  }

  async addPostId(id, postId) {
    const user = await this.userModel.findById(id);
    if (!user) throw new BadRequestException('user not found');

    const posts = user.posts;
    posts.push(postId);

    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      { ...user, posts },
      {
        new: true,
      },
    );
    return updatedUser;
  }
}
