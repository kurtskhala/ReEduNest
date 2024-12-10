import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Get()
  getUsers() {
    return this.usersService.getAllUsers();
  }

  @Get(":id")
  getUserById(@Param() params) {
    return this.usersService.getUserById(Number(params.id));
  }

  @Post()
  createuser(@Body() body) {
    return this.usersService.createUser(body);
  }

  @Delete(":id")
  deleteuser(@Param() params) {
    return this.usersService.deleteUser(Number(params.id));
  }
  
  @Put(":id")
  updateUser(@Param() params, @Body() body) {
    return this.usersService.updateUser(Number(params.id), body);
  }
}

