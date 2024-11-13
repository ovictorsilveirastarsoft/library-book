import { IsBoolean, IsEmail, IsString, IsStrongPassword, Length } from "class-validator";

export class CreateUserDto {
  
  @IsString()
  @Length(5,255)
  name_user: string;
  
  @IsEmail()
  email_user: string;

  @IsStrongPassword()
  @Length(12,128)
  password_user: string;
  
  @IsBoolean()
  super_user: boolean;
}
