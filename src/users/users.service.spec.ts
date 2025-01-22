import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { User } from './schema/user.schema';
import { Post } from '../post/schema/post.schema';
import { Expense } from '../expenses/schema/expenses.schema';
import { BadGatewayException, NotFoundException, BadRequestException } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';

describe('UsersService', () => {
    let service: UsersService;
    let userModel: Model<User>;
    let postModel: Model<Post>;
    let expenseModel: Model<Expense>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: getModelToken(User.name),
                    useValue: {
                        find: jest.fn(),
                        findOne: jest.fn(),
                        findById: jest.fn(),
                        findByIdAndUpdate: jest.fn(),
                        findByIdAndDelete: jest.fn(),
                        create: jest.fn(),
                        countDocuments: jest.fn(),
                        deleteMany: jest.fn(),
                        insertMany: jest.fn(),
                    },
                },
                {
                    provide: getModelToken(Post.name),
                    useValue: {
                        deleteMany: jest.fn(),
                    },
                },
                {
                    provide: getModelToken(Expense.name),
                    useValue: {
                        deleteMany: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
        userModel = module.get<Model<User>>(getModelToken(User.name));
        postModel = module.get<Model<Post>>(getModelToken(Post.name));
        expenseModel = module.get<Model<Expense>>(getModelToken(Expense.name));
    });

    describe('getAllUsers', () => {
        it('should return all users', async () => {
            const result = [{ name: 'Test User' }];
            jest.spyOn(userModel, 'find').mockReturnValue({
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockResolvedValue(result),
            } as any);
            expect(await service.getAllUsers({ page: 1, take: 10 })).toEqual(result);
        });
    });

    describe('getCountUsers', () => {
        it('should return the count of users', async () => {
            const count = 5;
            jest.spyOn(userModel, 'countDocuments').mockResolvedValue(count);
            expect(await service.getCountUsers()).toEqual(count);
        });
    });

    describe('findOneByEmail', () => {
        it('should return a user by email', async () => {
            const user = { email: 'n12bla@gmail.com', password: 'password' };
            jest.spyOn(userModel, 'findOne').mockResolvedValue(user as any);
            expect(await service.findOneByEmail('n12bla@gmail.com')).toEqual(user);
        });
    });

    describe('getUserById', () => {
        it('should return a user by id', async () => {
            const user = { _id: '676d45511b5accc96e75e871', name: 'Test User' };
            jest.spyOn(userModel, 'findById').mockResolvedValue(user as any);
            expect(await service.getUserById('676d45511b5accc96e75e871')).toEqual(user);
        });

        it('should throw an error if id is invalid', async () => {
            await expect(service.getUserById('invalid')).rejects.toThrow(BadGatewayException);
        });
    });

    describe('createUser', () => {
        it('should create a new user', async () => {
            const user = { email: 'test@test.com' };
            jest.spyOn(userModel, 'create').mockResolvedValue(user as any);
            jest.spyOn(userModel, 'findOne').mockResolvedValue(null);
            expect(await service.createUser(user)).toEqual(user);
        });

        it('should throw an error if user already exists', async () => {
            const user = { email: 'test@test.com' };
            jest.spyOn(userModel, 'findOne').mockResolvedValue(user as any);
            await expect(service.createUser(user)).rejects.toThrow(BadGatewayException);
        });
    });

    describe('deleteUser', () => {
        it('should delete a user', async () => {
            const mockId = new mongoose.Schema.Types.ObjectId('676d45511b5accc96e75e871');
            const user = { 
                _id: mockId
            };
    
            jest.spyOn(userModel, 'findById').mockResolvedValue(user as any);
            jest.spyOn(userModel, 'findByIdAndDelete').mockResolvedValue(user as any);
    
            expect(await service.deleteUser(mockId)).toEqual({ 
                message: 'user deleted', 
                data: user 
            });
        });
    
        it('should throw an error if user not found', async () => {
            const mockId = new mongoose.Schema.Types.ObjectId('676d45511b5accc96e75e871');
            jest.spyOn(userModel, 'findById').mockResolvedValue(null);
            await expect(service.deleteUser(mockId))
                .rejects
                .toThrow(NotFoundException);
        });
    });

    describe('updateUser', () => {
        it('should update a user', async () => {
            const user = { _id: '676d45511b5accc96e75e871', name: 'Updated User' };
            jest.spyOn(userModel, 'findByIdAndUpdate').mockResolvedValue(user as any);
            expect(await service.updateUser('676d45511b5accc96e75e871', user)).toEqual({ message: 'user updated successfully', data: user });
        });

        it('should throw an error if id is invalid', async () => {
            await expect(service.updateUser('invalid', {})).rejects.toThrow(BadGatewayException);
        });
    });

    describe('addExpenseId', () => {
        it('should add an expense id to user', async () => {
            const user = { _id: '676d45511b5accc96e75e871', expenses: [] };
            const updatedUser = { ...user, expenses: ['expense1'] };
            jest.spyOn(userModel, 'findById').mockResolvedValue(user as any);
            jest.spyOn(userModel, 'findByIdAndUpdate').mockResolvedValue(updatedUser as any);
            expect(await service.addExpenseId('1', 'expense1')).toEqual(updatedUser);
        });

        it('should throw an error if user not found', async () => {
            jest.spyOn(userModel, 'findById').mockResolvedValue(null);
            await expect(service.addExpenseId('1', 'expense1')).rejects.toThrow(BadRequestException);
        });
    });

    describe('addPostId', () => {
        it('should add a post id to user', async () => {
            const user = { _id: '1', posts: [] };
            const updatedUser = { ...user, posts: ['post1'] };
            jest.spyOn(userModel, 'findById').mockResolvedValue(user as any);
            jest.spyOn(userModel, 'findByIdAndUpdate').mockResolvedValue(updatedUser as any);
            expect(await service.addPostId('1', 'post1')).toEqual(updatedUser);
        });

        it('should throw an error if user not found', async () => {
            jest.spyOn(userModel, 'findById').mockResolvedValue(null);
            await expect(service.addPostId('1', 'post1')).rejects.toThrow(BadRequestException);
        });
    });
});