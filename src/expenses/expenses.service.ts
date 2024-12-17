import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateExpense } from './DTOs/create-expenses.dto';
import { UpdateExpense } from './DTOs/update-expenses.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ExpensesService {
  constructor(private usersService: UsersService) {}

  private expenses = [
    {
      id: 1,
      category: 'Food',
      productName: 'Egg',
      quantity: 4,
      price: 5,
      totalPrice: 20,
      user: "la@gmail.com"
    },
    {
      id: 2,
      category: 'Cleaning',
      productName: 'Shampoo',
      quantity: 1,
      price: 10,
      totalPrice: 10,
      user: "la@gmail.com"
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

  createExpense(body: CreateExpense, userId: number) {
    const lastId = this.expenses[this.expenses.length - 1]?.id || 0;
    const totalPrice = Number(body.price) * Number(body.quantity);
    const user = this.usersService.getUserById(userId);

    const newExpense = {
      id: lastId + 1,
      category: body.category,
      productName: body.productName,
      quantity: body.quantity,
      price: body.price,
      totalPrice,
      user: user.email
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
