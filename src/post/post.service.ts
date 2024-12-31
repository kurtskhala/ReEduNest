import {
  BadGatewayException,
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { UsersService } from 'src/users/users.service';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './schema/post.schema';
import mongoose, { isValidObjectId, Model } from 'mongoose';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    private usersService: UsersService,
  ) {}

  findAll() {
    return this.postModel.find();
  }

  async findOne(id: mongoose.Schema.Types.ObjectId) {
    const expense = await this.postModel.findById(id).populate('user');
    return expense || {};
  }

  async create(body: CreatePostDto, userId: string) {
    const user = await this.usersService.getUserById(userId);
    if (!Object.keys(user).length)
      throw new BadRequestException('user not found');
    if ('_id' in user) {
      const post = await this.postModel.create({
        ...body,
        user: user._id,
      });
      await this.usersService.addPostId(user._id, post._id);
      return post;
    }
  }

  update(id: mongoose.Schema.Types.ObjectId, updatePostDto: UpdatePostDto) {
    return this.postModel.updateOne(id, updatePostDto)
  }

  async remove(id, userId, role) {
    const post = await this.postModel.findById(id);

    if (!post) {
      throw new BadGatewayException('Expense not found');
    }

    if (role === 'admin' || userId === post.user.toString()) {
      const deletedPost = await this.postModel.findByIdAndDelete(id);
      return { message: 'post deleted', data: deletedPost };
    }

    throw new BadGatewayException('Permission denied');
  }
}
