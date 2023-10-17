import { IsEmail, IsString, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional() n
  email: string;

  @IsString()
  @IsOptional()
  password: string;
}