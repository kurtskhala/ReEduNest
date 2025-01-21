import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    example: 'My First Post',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: 'This is the content of my first post.',
  })
  @IsNotEmpty()
  @IsString()
  content: string;
}