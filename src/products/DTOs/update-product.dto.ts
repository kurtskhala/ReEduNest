import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateProduct {
  @ApiPropertyOptional({
    example: 'Updated Cup',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: '150',
  })
  @IsOptional()
  @IsString()
  price?: string;

  @ApiPropertyOptional({
    example: 'kitchen',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    example: '2024-01-22T10:00:00Z',
  })
  @IsOptional()
  @IsString()
  createdAt?: string;
}