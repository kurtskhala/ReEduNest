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
import { RolesGuard } from './rolesGuard';

@Controller('users')
// @UseGuards(RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Get()
  getUsers() {
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  getUserById(@Param() params) {
    return this.usersService.getUserById(Number(params.id));
  }

  @Post()
  createuser(@Body() body) {
    return this.usersService.createUser(body);
  }

  @Delete(':id')
  deleteuser(@Param('id', ParseIntPipe) id) {
    return this.usersService.deleteUser(id);
  }

  @Put(':id')
  updateUser(@Param('id', ParseIntPipe) id, @Body() body) {
    return this.usersService.updateUser(id, body);
  }
}
