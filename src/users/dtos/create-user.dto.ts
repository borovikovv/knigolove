import { IsString, IsEmail, IsNumber } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsNumber()
  role: number;
}
