import { IsString, IsOptional, MaxLength, IsUrl } from 'class-validator';

export class UpdateNewsDto {
  @IsString()
  @IsOptional()
  @MaxLength(80)
  title?: string;

  @IsString()
  @IsOptional()
  excerpt?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  content?: string;

  @IsString()
  @IsOptional()
  @IsUrl()
  image?: string;

  @IsString()
  @IsOptional()
  author?: string;
}
