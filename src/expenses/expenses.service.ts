import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateExpense } from './DTOs/create-expenses.dto';
import { UpdateExpense } from './DTOs/update-expenses.dto';

@Injectable()
export class ExpensesService {
  private expenses = [
    {
      id: 1,
      category: 'Food',
      productName: 'Egg',
      quantity: 4,
      price: 5,
      totalPrice: 20,
    },
    {
      id: 2,
      category: 'Cleaning',
      productName: 'Shampoo',
      quantity: 1,
      price: 10,
      totalPrice: 10,
    },
  ];

  getAllExpenses() {
    return this.expenses;
  }

  getExpenseById(id: number) {
    const expense = this.expenses.find((el) => el.id === id);
    if (!expense) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return expense;
  }

  createExpense(body: CreateExpense) {
    const lastId = this.expenses[this.expenses.length - 1]?.id || 0;
    const totalPrice = Number(body.price) * Number(body.quantity);
    const newExpense = {
      id: lastId + 1,
      category: body.category,
      productName: body.productName,
      quantity: body.quantity,
      price: body.price,
      totalPrice
    };
    this.expenses.push(newExpense);
    return newExpense;
  }

  deleteExpense(id: number) {
    const index = this.expenses.findIndex((el) => el.id === id);
    if (index === -1)
      throw new HttpException('User id is invalid', HttpStatus.BAD_REQUEST);
    const deletedExpense = this.expenses.splice(index, 1);
    return deletedExpense;
  }

  updateExpense(id: number, body: UpdateExpense) {
    const index = this.expenses.findIndex((el) => el.id === id);
    if (index === -1)
      throw new HttpException('User id is invalid', HttpStatus.BAD_REQUEST);
    const updatedExpense = {
      ...this.expenses[index],
      ...body,
    };
    const updatedTotal = Number(updatedExpense.price) * Number(updatedExpense.quantity);
    const updatedExpenseWithTotal = {
        ...updatedExpense,
        totalPrice: updatedTotal
    };

    this.expenses[index] = updatedExpenseWithTotal;
    return updatedExpenseWithTotal;
  }
}
