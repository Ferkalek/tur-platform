import { IsString, IsNotEmpty, MaxLength, IsUrl } from 'class-validator';

export class CreateNewsDto {
  @IsString()
  @IsNotEmpty({ message: 'Заголовок обов\'язковий' })
  @MaxLength(80, { message: 'Заголовок не може бути довше 80 символів' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Короткий опис обов\'язковий' })
  excerpt: string;

  @IsString()
  @IsNotEmpty({ message: 'Контент обов\'язковий' })
  @MaxLength(255, { message: 'Контент не може бути довше 255 символів' })
  content: string;

  @IsString()
  @IsUrl({}, { message: 'Невалідна URL адреса зображення' })
  image: string;

  @IsString()
  @IsNotEmpty({ message: 'Автор обов\'язковий' })
  author: string;
}
