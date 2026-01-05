import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Невалідний email' })
  email: string;

  @IsString()
  password: string;
}
