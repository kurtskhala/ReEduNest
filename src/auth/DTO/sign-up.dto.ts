import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
} from 'class-validator';
export class SignUpDto {
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
    example: "johndoe@gmail.com"
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: "+1234567890"
  })
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    example: "Male"
  })
  @IsNotEmpty()
  @IsString()
  gender: string;

  @ApiProperty({
    example: 25
  })
  @IsNotEmpty()
  @IsNumber()
  age: number;

  @ApiProperty({
    example: "password",
    minLength: 4,
    maxLength: 20,
  })
  @IsNotEmpty()
  @IsString()
  @Length(4, 20)
  password: string;
}
