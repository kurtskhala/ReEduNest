import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { SignUpDto } from './DTO/sign-up.dto';
import { SignInDto } from './DTO/sign-in.dto';
import mongoose from 'mongoose';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOneByEmail: jest.fn(),
            createUser: jest.fn(),
            getUserById: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('signUp', () => {
    const signUpDto: SignUpDto = {
        email: 'test@test.com',
        password: 'password123',
        firstName: 'nik',
        lastName: 'kurt',
        phoneNumber: '551',
        gender: 'Male',
        age: "0",
        avatar: 'avatar',
    };

    it('should successfully create a new user', async () => {
      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue(null);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword' as never);
      jest.spyOn(usersService, 'createUser').mockResolvedValue({} as any);

      const result = await service.signUp(signUpDto);

      expect(result).toBe('user created successfully');
      expect(usersService.findOneByEmail).toHaveBeenCalledWith(signUpDto.email);
      expect(bcrypt.hash).toHaveBeenCalledWith(signUpDto.password, 10);
      expect(usersService.createUser).toHaveBeenCalledWith({
        ...signUpDto,
        password: 'hashedPassword',
      });
    });

    it('should throw BadRequestException if user already exists', async () => {
      jest
        .spyOn(usersService, 'findOneByEmail')
        .mockResolvedValue({ email: signUpDto.email } as any);

      await expect(service.signUp(signUpDto)).rejects.toThrow(
        new BadRequestException('User already exists'),
      );
    });
  });

  describe('signIn', () => {
    const signInDto: SignInDto = {
      email: 'test@test.com',
      password: 'password123',
    };

    const mockUser = {
      _id: new mongoose.Types.ObjectId(),
      email: 'test@test.com',
      password: 'hashedPassword',
      role: 'user',
    };

    it('should successfully sign in and return access token', async () => {
      jest
        .spyOn(usersService, 'findOneByEmail')
        .mockResolvedValue(mockUser as any);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      jest.spyOn(jwtService, 'sign').mockReturnValue('mockAccessToken');

      const result = await service.signIn(signInDto);

      expect(result).toEqual({ accessToken: 'mockAccessToken' });
      expect(usersService.findOneByEmail).toHaveBeenCalledWith(signInDto.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        signInDto.password,
        mockUser.password,
      );
      expect(jwtService.sign).toHaveBeenCalledWith(
        {
          userId: mockUser._id,
          role: mockUser.role,
        },
        {
          expiresIn: '1h',
        },
      );
    });

    it('should throw BadRequestException if user not found', async () => {
      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue(null);

      await expect(service.signIn(signInDto)).rejects.toThrow(
        new BadRequestException('Email or passwor is not correct'),
      );
    });

    it('should throw BadRequestException if password is incorrect', async () => {
      jest
        .spyOn(usersService, 'findOneByEmail')
        .mockResolvedValue(mockUser as any);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(service.signIn(signInDto)).rejects.toThrow(
        new BadRequestException('Email or passwor is not correct'),
      );
    });
  });

  describe('getCurrentUser', () => {
    const userId = new mongoose.Types.ObjectId().toString();

    it('should return current user', async () => {
      const mockUser = { _id: userId, email: 'test@test.com' };
      jest
        .spyOn(usersService, 'getUserById')
        .mockResolvedValue(mockUser as any);

      const result = await service.getCurrentUser(userId);

      expect(result).toEqual(mockUser);
      expect(usersService.getUserById).toHaveBeenCalledWith(userId);
    });

    it('should return empty object if user not found', async () => {
      jest.spyOn(usersService, 'getUserById').mockResolvedValue({} as any);

      const result = await service.getCurrentUser(userId);

      expect(result).toEqual({});
      expect(usersService.getUserById).toHaveBeenCalledWith(userId);
    });
  });
});
