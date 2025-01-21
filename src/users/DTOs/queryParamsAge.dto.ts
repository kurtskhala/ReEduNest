import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class QueryParamsAgeDto {
  @ApiProperty({
    example: 20,
    required: false,
  })
  @Transform(({ value }) => Number(value))
  @IsOptional()
  @IsInt()
  @Min(0)
  ageFrom: number;

  @ApiProperty({
    example: 30,
    required: false,
  })
  @Transform(({ value }) => Number(value))
  @IsOptional()
  @IsInt()
  @Min(0)
  ageTo: number;
}