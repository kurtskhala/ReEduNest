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
import { HasUser } from 'src/guards/hasUser.guard';
import { HasValidUserId } from './hasValidUserId.guard';
import { CreateExpense } from './DTOs/create-expenses.dto';
import { UpdateExpense } from './DTOs/update-expenses.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('expenses')
export class ExpensesController {
  constructor(private ExpensesService: ExpensesService) {}
  @Get()
  getUsers() {
    return this.ExpensesService.getAllExpenses();
  }

  @Get(':id')
  getUserById(@Param() params) {
    return this.ExpensesService.getExpenseById(params.id);
  }

  @Post()
  @UseGuards(HasValidUserId)
  createuser(@Body() body: CreateExpense, @Req() request) {
    const userId = request.userId;    
    return this.ExpensesService.createExpense(body, userId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  deleteuser(@Param() params, @Req() request) {    
    const userId = request.userId;
    const role = request.role;
    return this.ExpensesService.deleteExpense(params.id, userId, role);
  }

  @Put(':id')
  updateUser(@Param() params, @Body() body: UpdateExpense) {
    return this.ExpensesService.updateExpense(params.id, body);
  }
}
