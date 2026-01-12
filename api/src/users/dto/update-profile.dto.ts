import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  MaxLength,
  IsPhoneNumber,
  IsUrl,
  IsEmail,
} from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsEmail({}, { message: 'Invalid email' })
  email: string;

  @ApiPropertyOptional({
    description: "Ім'я користувача",
    example: 'Іван',
    maxLength: 100,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50, { message: 'First name cannot exceed 50 characters' })
  firstName?: string;

  @ApiPropertyOptional({
    description: 'Прізвище користувача',
    example: 'Петренко',
    maxLength: 100,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50, { message: 'Last name cannot exceed 50 characters' })
  lastName?: string;

  @ApiPropertyOptional({
    description: 'Номер телефону',
    example: '+380501234567',
    maxLength: 20,
  })
  @IsString()
  @IsOptional()
  @IsPhoneNumber(undefined, { message: 'Invalid phone number' })
  @MaxLength(20, { message: 'Phone number cannot exceed 20 characters' })
  phone?: string;

  @ApiPropertyOptional({
    description: 'URL аватара',
    example: 'https://i.pravatar.cc/300',
  })
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiPropertyOptional({
    description: 'Коротка біографія',
    example: 'Full-stack розробник з 5-річним досвідом',
    maxLength: 500,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255, { message: 'Bio cannot exceed 255 characters' })
  bio?: string;

  @ApiPropertyOptional({
    description: 'Посилання на соціальну мережу',
    example: 'https://linkedin.com/in/ivan-petrenko',
  })
  @IsString()
  @IsOptional()
  @IsUrl({}, { message: 'Invalid social link URL' })
  socialLink?: string;
}
