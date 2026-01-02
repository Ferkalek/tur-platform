import { IsString, IsNotEmpty, MaxLength, IsUrl } from 'class-validator';

export class CreateNewsDto {
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  @MaxLength(80, { message: 'Title cannot exceed 80 characters' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Excerpt is required' })
  excerpt: string;

  @IsString()
  @IsNotEmpty({ message: 'Content is required' })
  @MaxLength(255, { message: 'Content cannot exceed 255 characters' })
  content: string;

  @IsString()
  @IsUrl({}, { message: 'Invalid image URL' })
  image: string;

  @IsString()
  @IsNotEmpty({ message: 'Author is required' })
  author: string;
}
