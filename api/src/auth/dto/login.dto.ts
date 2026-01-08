import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Invalid email' })
  email: string;

  @IsString()
  password: string;
}
