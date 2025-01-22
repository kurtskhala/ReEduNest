import mongoose, { Model } from "mongoose";
import { ExpensesService } from "./expenses.service";
import { UsersService } from "src/users/users.service";
import { Expense } from "./schema/expenses.schema";

describe('ExpensesService', () => {
    let service: ExpensesService;
    let expenseModel: Model<Expense>;
    let usersService: UsersService;
    const mockId = new mongoose.Schema.Types.ObjectId('507f1f77bcf86cd799439011');
  
    beforeEach(async () => {
      usersService = {
        getUserById: jest.fn(),
        addExpenseId: jest.fn()
      } as any;
  
      expenseModel = {
        create: jest.fn(),
        find: jest.fn(),
        findById: jest.fn(),
        findByIdAndDelete: jest.fn(),
        findByIdAndUpdate: jest.fn(),
        populate: jest.fn()
      } as any;
  
      service = new ExpensesService(expenseModel, usersService);
    });
  
    describe('getAllExpenses', () => {
      it('should return all expenses', async () => {
        const mockExpenses = [{ price: 10 }, { price: 20 }];
        jest.spyOn(expenseModel, 'find').mockResolvedValue(mockExpenses as any);
  
        const result = await service.getAllExpenses();
        expect(result).toEqual(mockExpenses);
      });
    });
  
    describe('getExpenseById', () => {
      it('should return expense by id', async () => {
        const mockExpense = { price: 10 };
        jest.spyOn(expenseModel, 'findById').mockReturnValue({
          populate: jest.fn().mockResolvedValue(mockExpense)
        } as any);
  
        const result = await service.getExpenseById(mockId);
        expect(result).toEqual(mockExpense);
      });
  
      it('should throw error if id is invalid', async () => {
        await expect(service.getExpenseById('invalid-id'))
          .rejects
          .toThrow('Not valid id is provided');
      });
    });
  
    describe('createExpense', () => {
      it('should create expense with total price', async () => {
        const mockUser = { _id: mockId };
        const mockExpense = { 
          _id: mockId, 
          price: '10',
          quantity: '2',
          totalPrice: 20
        };
  
        jest.spyOn(usersService, 'getUserById').mockResolvedValue(mockUser as any);
        jest.spyOn(expenseModel, 'create').mockResolvedValue(mockExpense as any);
  
        const result = await service.createExpense({
            price: 10,
            quantity: 2,
            category: "",
            productName: ""
        }, mockId.toString());
  
        expect(result).toEqual(mockExpense);
        expect(usersService.addExpenseId).toHaveBeenCalledWith(mockUser._id, mockExpense._id);
      });
  
      it('should throw error if user not found', async () => {
        jest.spyOn(usersService, 'getUserById').mockResolvedValue({} as any);
  
        await expect(service.createExpense({
            price: 10,
            quantity: 2,
            category: "",
            productName: ""
        }, 'userId')).rejects.toThrow('user not found');
      });
    });
  
    describe('deleteExpense', () => {
      it('should delete expense if user is owner', async () => {
        const mockExpense = { user: mockId.toString() };
        jest.spyOn(expenseModel, 'findById').mockResolvedValue(mockExpense as any);
        jest.spyOn(expenseModel, 'findByIdAndDelete').mockResolvedValue(mockExpense as any);
  
        const result = await service.deleteExpense(mockId, mockId.toString(), 'user');
        expect(result.message).toBe('expense deleted');
        expect(result.data).toEqual(mockExpense);
      });
  
      it('should throw error if expense not found', async () => {
        jest.spyOn(expenseModel, 'findById').mockResolvedValue(null);
  
        await expect(service.deleteExpense(mockId, 'userId', 'user'))
          .rejects
          .toThrow('Expense not found');
      });
    });
  
    describe('updateExpense', () => {
      it('should update expense and recalculate total', async () => {
        const existingExpense = { 
          price: '10',
          quantity: '2',
          totalPrice: 20
        };
        
        const updateData = {
          price: 20,
          quantity: 3
        };
  
        jest.spyOn(expenseModel, 'findById').mockResolvedValue(existingExpense as any);
        jest.spyOn(expenseModel, 'findByIdAndUpdate').mockResolvedValue({
          ...existingExpense,
          ...updateData,
          totalPrice: 60
        } as any);
  
        const result = await service.updateExpense(mockId, updateData);
        expect(result.data.totalPrice).toBe(60);
      });
  
      it('should throw error if expense not found', async () => {
        jest.spyOn(expenseModel, 'findById').mockResolvedValue(null);
  
        await expect(service.updateExpense(mockId, { price: 10 }))
          .rejects
          .toThrow('Expense not found');
      });
    });
  });