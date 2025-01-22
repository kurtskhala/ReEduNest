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
import { AuthGuard } from '../auth/auth.guard';
import { IsAdmin, IsEditor, IsViewer, Permission } from './permissions.guard';
import { HasUser } from '../guards/hasUser.guard';
import { IsValidMongoId } from '../users/DTOs/isValidMongoId.dto';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

@ApiTags('Posts')
@ApiBearerAuth()
@Controller('post')
@UseGuards(Permission)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiOperation({ summary: 'Create new post' })
  @ApiBody({ type: CreatePostDto })
  @ApiResponse({
    status: 201,
    example: {
      _id: '65ae7d32c1256fcec4f0f3a2',
      title: 'My First Blog Post',
      content: 'This is the content of my first blog post...',
      user: '65ae7d32c1256fcec4f0f3a1',
      createdAt: '2024-01-22T10:00:00.000Z',
      updatedAt: '2024-01-22T10:00:00.000Z',
    },
  })
  @ApiBadRequestResponse({
    example: {
      message: 'user not found',
      error: 'Bad Request',
      status: 400,
    },
  })
  @Post()
  @UseGuards(AuthGuard)
  create(@Req() request, @Body() createPostDto: CreatePostDto) {
    const userId = request.headers['user-id'];
    return this.postService.create(createPostDto, userId);
  }

  @ApiOperation({ summary: 'Get all posts' })
  @ApiResponse({
    status: 200,
    example: [
      {
        _id: '65ae7d32c1256fcec4f0f3a2',
        title: 'My First Blog Post',
        content: 'This is the content of my first blog post...',
        user: '65ae7d32c1256fcec4f0f3a1',
        createdAt: '2024-01-22T10:00:00.000Z',
        updatedAt: '2024-01-22T10:00:00.000Z',
      },
    ],
  })
  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @ApiOperation({ summary: 'Get post by ID' })
  @ApiParam({
    name: 'id',
    example: '65ae7d32c1256fcec4f0f3a2',
    description: 'Post ID',
  })
  @ApiResponse({
    status: 200,
    example: {
      _id: '65ae7d32c1256fcec4f0f3a2',
      title: 'My First Blog Post',
      content: 'This is the content of my first blog post...',
      user: {
        _id: '65ae7d32c1256fcec4f0f3a1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      },
      createdAt: '2024-01-22T10:00:00.000Z',
      updatedAt: '2024-01-22T10:00:00.000Z',
    },
  })
  @Get(':id')
  findOne(@Param() param: IsValidMongoId) {
    return this.postService.findOne(param.id);
  }

  @ApiOperation({ summary: 'Update post' })
  @ApiParam({
    name: 'id',
    example: '65ae7d32c1256fcec4f0f3a2',
    description: 'Post ID',
  })
  @ApiBody({ type: UpdatePostDto })
  @ApiResponse({
    status: 200,
    example: {
      acknowledged: true,
      modifiedCount: 1,
      upsertedId: null,
      upsertedCount: 0,
      matchedCount: 1,
    },
  })
  @Patch(':id')
  update(@Param() param: IsValidMongoId, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(param.id, updatePostDto);
  }

  @ApiOperation({ summary: 'Delete post' })
  @ApiParam({
    name: 'id',
    example: '65ae7d32c1256fcec4f0f3a2',
    description: 'Post ID',
  })
  @ApiResponse({
    status: 200,
    example: {
      message: 'post deleted',
      data: {
        _id: '65ae7d32c1256fcec4f0f3a2',
        title: 'My First Blog Post',
        content: 'This is the content of my first blog post...',
        user: '65ae7d32c1256fcec4f0f3a1',
      },
    },
  })
  @ApiBadRequestResponse({
    example: {
      message: 'Permission denied',
      error: 'Bad Gateway',
      status: 502,
    },
  })
  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param() params, @Req() request) {
    const userId = request.userId;
    const role = request.role;
    return this.postService.remove(params.id, userId, role);
  }
}
