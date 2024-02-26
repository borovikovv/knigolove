import {
  Controller,
  Post,
  Body,
  Get,
  HttpCode,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from '../auth/auth.service';
import { Serialize } from 'src/interceptops';
import { RequestWithUser, SignInUserDto } from './dtos/signin.dto';
import { UserDto } from 'src/users/dtos/user.dto';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { LocalAuthGuard } from 'src/guards/auth.guard';
import JwtAuthGuard from 'src/guards/jwt.guards';

@Controller('auth')
@Serialize(UserDto)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signup(
    @Body() { email, password, first_name, last_name, role }: CreateUserDto,
  ) {
    const user = await this.authService.signup({
      email,
      password,
      first_name,
      last_name,
      role,
    });

    return user;
  }

  @HttpCode(200)
  @Post('/signin')
  async signin(
    @Body() { email, password }: SignInUserDto,
    @Req() request: RequestWithUser,
    @Res() response: Response,
  ) {
    const user = await this.authService.signin(email, password);
    const cookie = this.authService.getCookieWithJwtToken(user.id);
    response.cookie('Set-Cookie', cookie);
    response.send(user);
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/who')
  async whoIAm(@Req() request: RequestWithUser) {
    const user = request.user;
    return user;
  }

  @UseGuards(LocalAuthGuard)
  @Post('/signout')
  async signOut(@Req() request: RequestWithUser, @Res() response: Response) {
    response.setHeader('Set-Cookie', this.authService.getCookieForLogOut());
    return response.sendStatus(200);
  }
}
