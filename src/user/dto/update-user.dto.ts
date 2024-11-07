import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name_user?: string;

  @IsEmail()
  @IsOptional()
  email_user?: string;

  @IsString()
  @IsOptional()
  @MinLength(6)
  password_user?: string;
}
