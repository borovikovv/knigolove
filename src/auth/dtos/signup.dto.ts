import { IsString, IsEmail, IsNumber } from 'class-validator';

export class SignUpUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsNumber()
  role: string;
}
