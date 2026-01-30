import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsArray, IsOptional, MaxLength } from 'class-validator';

export class UpdateNewsDto {
  @IsString()
  @IsOptional()
  id?: string;

  @ApiPropertyOptional({
    description: 'Заголовок новини',
    example: 'Оновлений заголовок',
    maxLength: 80,
  })
  @IsString()
  @IsOptional()
  @MaxLength(80)
  title?: string;

  @ApiPropertyOptional({
    description: 'Короткий опис новини',
    example: 'Оновлений опис',
  })
  @IsString()
  @IsOptional()
  excerpt?: string;

  @ApiPropertyOptional({
    description: 'Повний контент новини',
    example: 'Оновлений контент...',
    maxLength: 255,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  content?: string;

  @ApiPropertyOptional({
    description: 'URL зображення',
    example: ['https://picsum.photos/800/400'],
  })
  @IsArray()
  @IsOptional()
  images?: string[];

  @IsString()
  @IsOptional()
  createdAt?: Date;

  @IsString()
  @IsOptional()
  updatedAt?: Date;
}
