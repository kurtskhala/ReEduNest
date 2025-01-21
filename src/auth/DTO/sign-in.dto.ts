import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
export class SignInDto {
  @ApiProperty({
    example: 'johndoe@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password',
    minLength: 4,
    maxLength: 20,
  })
  @IsNotEmpty()
  @IsString()
  @Length(4, 20)
  password: string;
}
