import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './DTO/sign-up.dto';
import { SignInDto } from './DTO/sign-in.dto';
import { AuthGuard } from './auth.guard';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { register } from 'module';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiCreatedResponse({ example: 'user registered successfully' })
  @ApiBadRequestResponse({
    example: {
      message: 'User already exists',
      error: 'Bad request',
      status: 400,
    },
  })
  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @ApiOkResponse({
    example: {
      accessToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzhmZmQ4Y2ZiNjM0ZjM3Mzc2ZjI2YzIiLCJyb2xlIjoidXNlciIsImlhdCI6MTczNzQ5MDUwNCwiZXhwIjoxNzM3NDk0MTA0fQ.PUq_4GoPzn_1YHiVCjmLPnxMqq_UdD3N6VQcrxGig5c',
    },
  })
  @ApiBadRequestResponse({
    example: {
      message: 'Email or passwor is not correct',
      error: 'Bad request',
      status: 400,
    },
  })
  @Post('sign-in')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    example: {
      _id: '678ffdd8cfb634f37376f26c2',
      firstName: 'John',
      lastName: 'Doe',
      email: '',
    },
  })
  @ApiUnauthorizedResponse({
    example: {
      message: 'Unauthorized',
      error: 'Unauthorized',
      status: 401,
    },
  })
  @Get('/current-user')
  @UseGuards(AuthGuard)
  getCuttentUser(@Req() request) {
    const userId = request.userId;
    return this.authService.getCurrentUser(userId);
  }
}
