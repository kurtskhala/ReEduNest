import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from './auth.guard';
import { IsAdmin, IsEditor, IsViewer, Permission } from './permissions.guard';
import { HasUser } from 'src/guards/hasUser.guard';

@Controller('post')
@UseGuards(Permission)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseGuards(HasUser)
  create(@Req() request ,@Body() createPostDto: CreatePostDto) {
    const userId = request.userId;    
    return this.postService.create(createPostDto, userId);
  }

  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(+id);
  }
}
