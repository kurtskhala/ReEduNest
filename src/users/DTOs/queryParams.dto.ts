import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class QueryParamsDto {
  @ApiProperty({
    example: 1,
    required: false,
  })
  @Transform(({ value }) => Number(value))
  @IsOptional()
  @IsInt()
  @Min(0)
  page: number = 1;

  @ApiProperty({
    example: 50,
    required: false,
  })
  @Transform(({ value }) => Number(value))
  @IsOptional()
  @IsInt()
  @Min(0)
  take: number = 50;
}