import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateExpense {
  @ApiProperty({
    example: 'Food',
  })
  @IsNotEmpty()
  @IsString()
  category: string;

  @ApiProperty({
    example: 'Groceries',
  })
  @IsNotEmpty()
  @IsString()
  productName: string;

  @ApiProperty({
    example: 2,
  })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @ApiProperty({
    example: 25.50,
  })
  @IsNotEmpty()
  @IsNumber()
  price: number;
}