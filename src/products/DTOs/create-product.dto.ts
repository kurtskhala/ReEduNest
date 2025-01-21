import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProduct {
  @ApiProperty({
    example: 'Cup',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: '100',
  })
  @IsNotEmpty()
  @IsString()
  price: string;

  @ApiProperty({
    example: 'kitchen',
  })
  @IsNotEmpty()
  @IsString()
  category: string;

  @ApiProperty({
    example: '2024-01-22T10:00:00Z',
  })
  @IsString()
  createdAt: string;
}