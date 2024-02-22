import { IsString, IsEmail } from 'class-validator';
import { Request } from 'express';
import { User } from 'src/users/user.entity';

export class SignInUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export interface TokenPayload {
  userId: number;
}
export interface RequestWithUser extends Request {
  user: User;
}

export interface TokenPayload {
  userId: number;
}
