import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './DTOs/create-user.dto';
import { UpdateUserDto } from './DTOs/update-user.dto';

@Injectable()
export class UsersService {
  private users = [
    {
      id: 1,
      firstName: 'Giorgi',
      lastName: 'Gogava',
      email: 'gi@gmail.com',
      phoneNumber: '555555555',
      gender: 'M',
    },
    {
      id: 2,
      firstName: 'Lana',
      lastName: 'Gogogava',
      email: 'la@gmail.com',
      phoneNumber: '555551111',
      gender: 'F',
    },
  ];

  getAllUsers() {
    return this.users;
  }

  getUserById(id: number) {
    const user = this.users.find((el) => el.id === id);
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return user;
  }

  createUser(body: CreateUserDto) {
    const lastId = this.users[this.users.length - 1]?.id || 0;
    const newUser = {
      id: lastId + 1,
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phoneNumber: body.phoneNumber,
      gender: body.gender,
    };
    this.users.push(newUser);
    return newUser;
  }

  deleteUser(id: number) {
    const index = this.users.findIndex((el) => el.id === id);
    if (index === -1)
      throw new HttpException('User id is invalid', HttpStatus.BAD_REQUEST);
    const deletedUser = this.users.splice(index, 1);
    return deletedUser;
  }

  updateUser(id: number, body: UpdateUserDto) {
    const index = this.users.findIndex((el) => el.id === id);
    if (index === -1)
      throw new HttpException('User id is invalid', HttpStatus.BAD_REQUEST);
    const updatedUser = {
      ...this.users[index],
      ...body,
    };
    this.users[index] = updatedUser;
    return updatedUser;
  }
}
