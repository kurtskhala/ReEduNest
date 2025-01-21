import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { HasValidUserId } from './hasValidUserId.guard';
import { CreateExpense } from './DTOs/create-expenses.dto';
import { UpdateExpense } from './DTOs/update-expenses.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('expenses')
export class ExpensesController {
  constructor(private ExpensesService: ExpensesService) {}

  @ApiOkResponse({
    example: [
      {
        _id: '678ffdd8cfb634f37376f26c2',
        category: 'Food',
        productName: 'Groceries',
        quantity: 2,
        price: 25.5,
        totalPrice: 51.0,
        user: '678ffdd8cfb634f37376f26c2',
      },
    ],
  })
  @Get()
  getUsers() {
    return this.ExpensesService.getAllExpenses();
  }

  @ApiOkResponse({
    example: {
      _id: '678ffdd8cfb634f37376f26c2',
      category: 'Food',
      productName: 'Groceries',
      quantity: 2,
      price: 25.5,
      totalPrice: 51.0,
      user: {
        _id: '678ffdd8cfb634f37376f26c2',
        firstName: 'John',
        lastName: 'Doe',
      },
    },
  })
  @ApiBadRequestResponse({
    example: {
      message: 'Not valid id is provided',
      error: 'Bad Gateway',
      status: 502,
    },
  })
  @Get(':id')
  getUserById(@Param() params) {
    return this.ExpensesService.getExpenseById(params.id);
  }

  @ApiBearerAuth()
  @ApiCreatedResponse({
    example: {
      _id: '678ffdd8cfb634f37376f26c2',
      category: 'Food',
      productName: 'Groceries',
      quantity: 2,
      price: 25.5,
      totalPrice: 51.0,
      user: '678ffdd8cfb634f37376f26c2',
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
  @UseGuards(HasValidUserId)
  createuser(@Body() body: CreateExpense, @Req() request) {
    const userId = request.userId;
    return this.ExpensesService.createExpense(body, userId);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    example: {
      message: 'expense deleted',
      data: {
        _id: '678ffdd8cfb634f37376f26c2',
        category: 'Food',
        productName: 'Groceries',
        quantity: 2,
        price: 25.5,
        totalPrice: 51.0,
        user: '678ffdd8cfb634f37376f26c2',
      },
    },
  })
  @ApiBadRequestResponse({
    example: {
      message: 'Expense not found',
      error: 'Bad Gateway',
      status: 502,
    },
  })
  @ApiUnauthorizedResponse({
    example: {
      message: 'Permission denied',
      error: 'Bad Gateway',
      status: 502,
    },
  })
  @Delete(':id')
  @UseGuards(AuthGuard)
  deleteuser(@Param() params, @Req() request) {
    const userId = request.userId;
    const role = request.role;
    return this.ExpensesService.deleteExpense(params.id, userId, role);
  }

  @ApiOkResponse({
    example: {
      message: 'expense updated successfully',
      data: {
        _id: '678ffdd8cfb634f37376f26c2',
        category: 'Food',
        productName: 'Groceries',
        quantity: 3,
        price: 25.5,
        totalPrice: 76.5,
        user: '678ffdd8cfb634f37376f26c2',
      },
    },
  })
  @ApiBadRequestResponse({
    example: {
      message: 'Not valid id is provided',
      error: 'Bad Gateway',
      status: 502,
    },
  })
  @Put(':id')
  updateUser(@Param() params, @Body() body: UpdateExpense) {
    return this.ExpensesService.updateExpense(params.id, body);
  }
}
