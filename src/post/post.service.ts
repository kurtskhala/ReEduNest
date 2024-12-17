import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PostService {
  constructor(private usersService: UsersService) {}
  private posts = [
    {
      id: 1,
      title: 'title1',
      content: 'random content 1',
      userEmail: 'gi@gmail.com',
    },
    {
      id: 2,
      title: 'title2',
      content: 'random content 2',
      userEmail: 'la@gmail.com',
    },
  ];

  findAll() {
    return this.posts;
  }

  findOne(id: number) {
    const post = this.posts.find((el) => el.id === id);
    if (!post) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    return post;
  }

  create(createPostDto: CreatePostDto, userId: number) {
    const lastId = this.posts[this.posts.length - 1]?.id || 0;
    const user = this.usersService.getUserById(userId);
    if(Array.isArray(user)) throw new BadRequestException("user not")
    const newPost = {
      id: lastId + 1,
      title: createPostDto.title,
      content: createPostDto.content,
      userEmail: user.email,
    };

    this.posts.push(newPost);
    return newPost;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    const index = this.posts.findIndex((el) => el.id === id);
    if (index === -1) {
      throw new HttpException('Post ID is invalid', HttpStatus.BAD_REQUEST);
    }

    const updatedPost = {
      ...this.posts[index],
      ...updatePostDto,
    };

    this.posts[index] = updatedPost;
    return updatedPost;
  }

  remove(id: number) {
    const index = this.posts.findIndex((el) => el.id === id);
    if (index === -1) {
      throw new HttpException('Post ID is invalid', HttpStatus.BAD_REQUEST);
    }

    const deletedPost = this.posts.splice(index, 1);
    return deletedPost;
  }
}