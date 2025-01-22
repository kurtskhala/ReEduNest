import mongoose, { Model } from "mongoose";
import { PostService } from "./post.service";
import { UsersService } from "../users/users.service";
import { Post } from "./schema/post.schema";

describe('PostService', () => {
    let service: PostService;
    let postModel: Model<Post>;
    let usersService: UsersService;
    const mockId = new mongoose.Schema.Types.ObjectId('507f1f77bcf86cd799439011');
  
    beforeEach(async () => {
      usersService = {
        getUserById: jest.fn(),
        addPostId: jest.fn()
      } as any;
  
      postModel = {
        create: jest.fn(),
        find: jest.fn(),
        findById: jest.fn(),
        findByIdAndDelete: jest.fn(),
        updateOne: jest.fn(),
        populate: jest.fn()
      } as any;
  
      service = new PostService(postModel, usersService);
    });
  
    describe('findAll', () => {
      it('should return all posts', async () => {
        const mockPosts = [{ title: 'Post 1' }, { title: 'Post 2' }];
        jest.spyOn(postModel, 'find').mockResolvedValue(mockPosts as any);
        
        const result = await service.findAll();
        expect(result).toEqual(mockPosts);
      });
    });
  
    describe('findOne', () => {
      it('should return post by id', async () => {
        const mockPost = { title: 'Post 1' };
        jest.spyOn(postModel, 'findById').mockReturnValue({
          populate: jest.fn().mockResolvedValue(mockPost)
        } as any);
  
        const result = await service.findOne(mockId);
        expect(result).toEqual(mockPost);
      });
  
      it('should return empty object if post not found', async () => {
        jest.spyOn(postModel, 'findById').mockReturnValue({
          populate: jest.fn().mockResolvedValue(null)
        } as any);
  
        const result = await service.findOne(mockId);
        expect(result).toEqual({});
      });
    });
  
    describe('create', () => {
      it('should create post and update user', async () => {
        const mockUser = { _id: mockId };
        const mockPost = { _id: mockId, title: 'New Post' };
        
        jest.spyOn(usersService, 'getUserById').mockResolvedValue(mockUser as any);
        jest.spyOn(postModel, 'create').mockResolvedValue(mockPost as any);
        
        const result = await service.create({
            title: 'New Post',
            content: ""
        }, mockId.toString());
        expect(result).toEqual(mockPost);
        expect(usersService.addPostId).toHaveBeenCalledWith(mockUser._id, mockPost._id);
      });
  
      it('should throw error if user not found', async () => {
        jest.spyOn(usersService, 'getUserById').mockResolvedValue({} as any);
        
        await expect(service.create({
            title: 'New Post',
            content: ""
        }, 'userId'))
          .rejects
          .toThrow('user not found');
      });
    });
  
    describe('update', () => {
      it('should update post', async () => {
        const updateDto = { title: 'Updated' };
        jest.spyOn(postModel, 'updateOne').mockResolvedValue({ modified: 1 } as any);
        
        await service.update(mockId, updateDto);
        expect(postModel.updateOne).toHaveBeenCalledWith(mockId, updateDto);
      });
    });
  
    describe('remove', () => {
      it('should remove post if user is owner', async () => {
        const mockPost = { user: mockId.toString() };
        jest.spyOn(postModel, 'findById').mockResolvedValue(mockPost as any);
        jest.spyOn(postModel, 'findByIdAndDelete').mockResolvedValue(mockPost as any);
  
        const result = await service.remove(mockId, mockId.toString(), 'user');
        expect(result.message).toBe('post deleted');
        expect(result.data).toEqual(mockPost);
      });
  
      it('should remove post if user is admin', async () => {
        const mockPost = { user: 'otherId' };
        jest.spyOn(postModel, 'findById').mockResolvedValue(mockPost as any);
        jest.spyOn(postModel, 'findByIdAndDelete').mockResolvedValue(mockPost as any);
  
        const result = await service.remove(mockId, 'otherId', 'admin');
        expect(result.message).toBe('post deleted');
      });
  
      it('should throw error if post not found', async () => {
        jest.spyOn(postModel, 'findById').mockResolvedValue(null);
  
        await expect(service.remove(mockId, 'userId', 'user'))
          .rejects
          .toThrow('Expense not found');
      });
  
      it('should throw error if user has no permission', async () => {
        const mockPost = { user: 'otherId' };
        jest.spyOn(postModel, 'findById').mockResolvedValue(mockPost as any);
  
        await expect(service.remove(mockId, 'userId', 'user'))
          .rejects
          .toThrow('Permission denied');
      });
    });
  });
  