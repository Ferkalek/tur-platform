import {
  IsString,
  IsOptional,
  MaxLength,
  IsPhoneNumber,
  IsUrl,
} from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  @MaxLength(50, { message: 'First name cannot exceed 50 characters' })
  firstName?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50, { message: 'Last name cannot exceed 50 characters' })
  lastName?: string;

  @IsString()
  @IsOptional()
  @IsPhoneNumber(undefined, { message: 'Invalid phone number' })
  @MaxLength(20, { message: 'Phone number cannot exceed 20 characters' })
  phone?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255, { message: 'Bio cannot exceed 255 characters' })
  bio?: string;

  @IsString()
  @IsOptional()
  @IsUrl({}, { message: 'Invalid social link URL' })
  socialLink?: string;
}
