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

@Controller('expenses')
export class ExpensesController {
  constructor(private ExpensesService: ExpensesService) {}
  @Get()
  getUsers() {
    return this.ExpensesService.getAllExpenses();
  }

  @Get(':id')
  getUserById(@Param() params) {
    return this.ExpensesService.getExpenseById(Number(params.id));
  }

  @Post()
  @UseGuards(HasUser)
  createuser(@Body() body, @Req() request) {
    const userId = request.userId;    
    return this.ExpensesService.createExpense(body, userId);
  }

  @Delete(':id')
  deleteuser(@Param() params) {
    return this.ExpensesService.deleteExpense(Number(params.id));
  }

  @Put(':id')
  updateUser(@Param() params, @Body() body) {
    return this.ExpensesService.updateExpense(Number(params.id), body);
  }
}
