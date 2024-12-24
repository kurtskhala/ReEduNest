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
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './DTOs/create-user.dto';
import { UpdateUserDto } from './DTOs/update-user.dto';
import { QueryParamsDto } from './DTOs/queryParams.dto';
import { QueryParamsAgeDto } from './DTOs/queryParamsAge.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  createuser(@Body() body: CreateUserDto) {
    return this.usersService.createUser(body);
  }

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

  @Get(':id')
  getUserById(@Param() params) {
    return this.usersService.getUserById(params.id);
  }

  @Put(':id')
  updateUser(@Param('id') id, @Body() body: UpdateUserDto) {
    return this.usersService.updateUser(id, body);
  }

  @Delete(':id')
  deleteuser(@Param('id') id) {
    return this.usersService.deleteUser(id);
  }
}
