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
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiParam,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './DTOs/create-user.dto';
import { UpdateUserDto } from './DTOs/update-user.dto';
import { QueryParamsDto } from './DTOs/queryParams.dto';
import { QueryParamsAgeDto } from './DTOs/queryParamsAge.dto';
import { AuthGuard } from '../auth/auth.guard';
import { User } from './users.decotator';
import { IsAdmin } from '../post/permissions.guard';
import { IsValidMongoId } from './DTOs/isValidMongoId.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOkResponse({
    example: [
      {
        _id: '678ffdd8cfb634f37376f26c2',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phoneNumber: '+1234567890',
        gender: 'Male',
        age: 25,
        posts: [],
        expenses: []
      }
    ]
  })
  @Get()
  getUsers(@Query() params: QueryParamsDto) {
    return this.usersService.getAllUsers(params);
  }

  @ApiOkResponse({
    example: [
      {
        _id: '678ffdd8cfb634f37376f26c2',
        firstName: 'John',
        lastName: 'Doe',
        age: 25
      }
    ]
  })
  @Get('age/range')
  getUsersByAgeRange(@Query() query: QueryParamsAgeDto) {
    return this.usersService.getUsersByAge(null, query);
  }

  @ApiOkResponse({
    example: [
      {
        _id: '678ffdd8cfb634f37376f26c2',
        firstName: 'John',
        lastName: 'Doe',
        age: 25
      }
    ]
  })
  @ApiParam({ name: 'age', example: 25 })
  @Get('age/:age')
  getUsersByAge(
    @Param('age', ParseIntPipe) age: number,
    @Query() query: QueryParamsAgeDto,
  ) {
    return this.usersService.getUsersByAge(age, query);
  }

  @ApiOkResponse({
    example: 150
  })
  @Get('countUsers')
  getCountUsers() {
    return this.usersService.getCountUsers();
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    example: {
      message: 'user updated successfully',
      data: {
        _id: '678ffdd8cfb634f37376f26c2',
        firstName: 'John Updated',
        lastName: 'Doe Updated',
        email: 'john.updated@example.com',
        phoneNumber: '+1234567890',
        gender: 'Male',
        age: 26
      }
    }
  })
  @ApiBadRequestResponse({
    example: {
      message: 'Not valid id is provided',
      error: 'Bad Gateway',
      status: 502
    }
  })
  @Put('')
  @UseGuards(AuthGuard)
  updateUser(@User() userId, @Body() body: UpdateUserDto) {
    return this.usersService.updateUser(userId, body);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    example: {
      message: 'user deleted',
      data: {
        _id: '678ffdd8cfb634f37376f26c2',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com'
      }
    }
  })
  @ApiUnauthorizedResponse({
    example: {
      message: 'Unauthorized',
      error: 'Unauthorized',
      status: 401
    }
  })
  @Delete('')
  @UseGuards(AuthGuard)
  deleteuser(@User() userId) {
    return this.usersService.deleteUser(userId);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    example: {
      message: 'user deleted',
      data: {
        _id: '678ffdd8cfb634f37376f26c2',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com'
      }
    }
  })
  @ApiUnauthorizedResponse({
    example: {
      message: 'Unauthorized',
      error: 'Unauthorized',
      status: 401
    }
  })
  @Delete(':id')
  @UseGuards(AuthGuard, IsAdmin)
  deleteOtherUser(@Param() params: IsValidMongoId) {
    return this.usersService.deleteUser(params.id);
  }
}