import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ExpensesService } from './expenses.service';

@Controller('expenses')
export class ExpensesController {
  constructor(private ExpensesService: ExpensesService) {}
  @Get()
  getUsers() {
    return this.ExpensesService.getAllExpenses();
  }

  @Get(":id")
  getUserById(@Param() params) {
    return this.ExpensesService.getExpenseById(Number(params.id));
  }

  @Post()
  createuser(@Body() body) {
    return this.ExpensesService.createExpense(body);
  }

  @Delete(":id")
  deleteuser(@Param() params) {
    return this.ExpensesService.deleteExpense(Number(params.id));
  }
  
  @Put(":id")
  updateUser(@Param() params, @Body() body) {
    return this.ExpensesService.updateExpense(Number(params.id), body);
  }
}

