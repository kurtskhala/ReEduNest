import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './DTOs/create-user.dto';
import { UpdateUserDto } from './DTOs/update-user.dto';
import { QueryParamsDto } from './DTOs/queryParams.dto';
import { QueryParamsAgeDto } from './DTOs/queryParamsAge.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from './users.decotator';
import { IsAdmin } from 'src/post/permissions.guard';
import { IsValidMongoId } from './DTOs/isValidMongoId.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // @Post()
  // createuser(@Body() body: CreateUserDto) {
  //   return this.usersService.createUser(body);
  // }

  @Get()
  getUsers(@Query() params: QueryParamsDto) {
    return this.usersService.getAllUsers(params);
  }

  @Get('age/range')
  getUsersByAgeRange(@Query() query: QueryParamsAgeDto) {
    return this.usersService.getUsersByAge(null, query);
  }

  @Get('age/:age')
  getUsersByAge(
    @Param('age', ParseIntPipe) age: number,
    @Query() query: QueryParamsAgeDto,
  ) {
    return this.usersService.getUsersByAge(age, query);
  }

  @Get('countUsers')
  getCountUsers() {
    return this.usersService.getCountUsers();
  }

  // @Get(':id')
  // getUserById(@Param() params) {
  //   return this.usersService.getUserById(params.id);
  // }

  @Put('')
  @UseGuards(AuthGuard)
  updateUser(@User() userId, @Body() body: UpdateUserDto) {
    return this.usersService.updateUser(userId, body);
  }

  @Delete('')
  @UseGuards(AuthGuard)
  deleteuser(@User() userId) {
    return this.usersService.deleteUser(userId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, IsAdmin)
  deleteOtherUser(@Param() params: IsValidMongoId) {
    return this.usersService.deleteUser(params.id);
  }
}
