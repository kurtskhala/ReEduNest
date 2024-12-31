import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { IsAdmin, IsEditor, IsViewer, Permission } from './permissions.guard';
import { HasUser } from 'src/guards/hasUser.guard';
import { IsValidMongoId } from 'src/users/DTOs/isValidMongoId.dto';

@Controller('post')
@UseGuards(Permission)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Req() request, @Body() createPostDto: CreatePostDto) {
    const userId = request.headers['user-id'];
    return this.postService.create(createPostDto, userId);
  }

  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Get(':id')
  findOne(@Param() param: IsValidMongoId) {
    return this.postService.findOne(param.id);
  }

  @Patch(':id')
  update(@Param() param: IsValidMongoId, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(param.id, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param() params, @Req() request) {
    const userId = request.userId;
    const role = request.role;
    return this.postService.remove(params.id, userId, role);
  }
}
