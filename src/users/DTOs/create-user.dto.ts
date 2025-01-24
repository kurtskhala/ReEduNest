import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'John',
  })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({
    example: 'Doe',
  })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({
    example: 'john.doe@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '+1234567890',
  })
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    example: 'Male',
  })
  @IsNotEmpty()
  @IsString()
  gender: string;

  @ApiProperty({
    example: 25,
  })
  @IsNotEmpty()
  @IsNumber()
  age: number;

  @ApiProperty({
    example: 'password123',
  })
  @IsNotEmpty()
  @IsString()
  @Length(4, 20)
  password: string;

  @ApiProperty({
    example: 'image/2343545464',
  })
  @IsNotEmpty()
  @IsString()
  avatar: string;
}
