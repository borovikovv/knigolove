import { IsString, IsEmail } from 'class-validator';
import { UserRolesTyps } from '../types/types';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsString()
  role: UserRolesTyps;
}
