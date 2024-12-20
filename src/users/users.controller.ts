import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './DTOs/create-user.dto';
import { UpdateUserDto } from './DTOs/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  
  @Post()
  createuser(@Body() body : CreateUserDto) {
    return this.usersService.createUser(body);
  }

  @Get()
  getUsers() {
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  getUserById(@Param() params) {
    return this.usersService.getUserById(params.id);
  }

  @Put(':id')
  updateUser(@Param('id', ParseIntPipe) id, @Body() body: UpdateUserDto) {
    return this.usersService.updateUser(id, body);
  }

  @Delete(':id')
  deleteuser(@Param('id', ParseIntPipe) id) {
    return this.usersService.deleteUser(id);
  }

}
