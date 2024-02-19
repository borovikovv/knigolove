import {
  Controller,
  Post,
  Body,
  Get,
  Session,
  HttpCode,
  Req,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from '../auth/auth.service';
import { Serialize } from 'src/interceptops';
import { RequestWithUser, SignInUserDto } from './dtos/signin.dto';
import { UserDto } from 'src/users/dtos/user.dto';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { CurrectUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';

@Controller('user')
@Serialize(UserDto)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async createUser(
    @Body() { email, password, first_name, last_name, role }: CreateUserDto,
    @Session() session: any,
  ) {
    const user = await this.authService.signup({
      email,
      password,
      first_name,
      last_name,
      role,
    });
    session.userId = user.id;

    return user;
  }

  @HttpCode(200)
  @Post('/signin')
  async signin(
    @Body() { email, password }: SignInUserDto,
    @Session() session: any,
    @Req() request: RequestWithUser,
    @Res() response: Response,
  ) {
    const user = await this.authService.signin(email, password);
    const cookie = this.authService.getCookieWithJwtToken(user.id);
    response.setHeader('Set-Cookie', cookie);
    session.userId = user.id;

    return user;
  }

  @Get('who')
  async whoIAm(@CurrectUser() user: User) {
    return user;
  }

  @Post('/signout')
  signOut(@Session() session: any) {
    session.userId = null;
  }
}
