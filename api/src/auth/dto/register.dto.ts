import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Невалідний email' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Пароль повинен містити мінімум 6 символів' })
  password: string;

  @IsString()
  @MaxLength(100)
  firstName: string;

  @IsString()
  @MaxLength(100)
  lastName: string;
}
