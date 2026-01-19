import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength, IsUrl } from 'class-validator';

export class CreateNewsDto {
  @ApiProperty({
    description: 'Заголовок новини',
    example: 'Нові технології в веб-розробці',
    maxLength: 80,
  })
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  @MaxLength(80, { message: 'Title cannot exceed 80 characters' })
  title: string;

  @ApiProperty({
    description: 'Короткий опис новини',
    example: 'Огляд найважливіших трендів 2025 року',
  })
  @IsString()
  @IsNotEmpty({ message: 'Excerpt is required' })
  excerpt: string;

  @ApiProperty({
    description: 'Повний контент новини',
    example: 'У 2025 році веб-розробка досягла нових висот...',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty({ message: 'Content is required' })
  @MaxLength(255, { message: 'Content cannot exceed 255 characters' })
  content: string;

  // @ApiProperty({
  //   description: 'URL зображення для новини',
  //   example: 'https://picsum.photos/800/400',
  // })
  // @IsString()
  // @IsUrl({}, { message: 'Invalid image URL' })
  // image: string;
}
