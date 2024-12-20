import {
  BadGatewayException,
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateExpense } from './DTOs/create-expenses.dto';
import { UpdateExpense } from './DTOs/update-expenses.dto';
import { UsersService } from 'src/users/users.service';
import { Expense } from './schema/expenses.schema';
import { isValidObjectId, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectModel(Expense.name) private expenseModel: Model<Expense>,
    private usersService: UsersService,
  ) {}

  getAllExpenses() {
    return this.expenseModel.find();
  }

  async getExpenseById(id) {
    if (!isValidObjectId(id))
      throw new BadGatewayException('Not valid id is provided');
    const expense = await this.expenseModel.findById(id).populate("user");
    return expense || {};
  }

  async createExpense(body: CreateExpense, userId) {
    const user = await this.usersService.getUserById(userId);
    const totalPrice = Number(body.price) * Number(body.quantity);
    if (!Object.keys(user).length)
      throw new BadRequestException('user not found');
    if ('_id' in user) {
      const expense = await this.expenseModel.create({
        ...body,
        totalPrice,
        user: user._id,
      });
      return expense;
    }
  }

  async deleteExpense(id) {
    if (!isValidObjectId(id))
      throw new BadGatewayException('Not valid id is provided');
    const expense = await this.expenseModel.findByIdAndDelete(id);
    return { message: 'expense deleted', data: expense };
  }

  async updateExpense(id: number, body: UpdateExpense) {
    if (!isValidObjectId(id))
      throw new BadGatewayException('Not valid id is provided');

    const existingExpense = await this.expenseModel.findById(id);
    if (!existingExpense) {
      throw new HttpException('Expense not found', HttpStatus.NOT_FOUND);
    }
    const updatedPrice = body.price || existingExpense.price;
    const updatedQuantity = body.quantity || existingExpense.quantity;
    const updatedTotal = Number(updatedPrice) * Number(updatedQuantity);

    const updatedBody = { ...body, totalPrice: updatedTotal };

    const updatedExpense = await this.expenseModel.findByIdAndUpdate(
      id,
      updatedBody,
      {
        new: true,
      },
    );
    return { message: 'expense updated successfully', data: updatedExpense };
  }
}
