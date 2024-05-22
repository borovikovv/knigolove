import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from '../auth/auth.service';
import { Serialize } from 'src/interceptops';
import { RequestWithUser, SignInUserDto } from './dtos/signin.dto';
import { UserDto } from 'src/users/dtos/user.dto';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { LocalAuthenticationGuard } from 'src/guards/local.guard';

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
  @UseGuards(LocalAuthenticationGuard)
  @Post('/login')
  async loginUser(
    @Req() request: RequestWithUser,
    @Body() { email, password }: SignInUserDto,
  ) {
    const user = await this.authService.signin(email, password);
    const toket = await this.authService.getJwtToken(user.id);
    return {
      ...user,
      toket,
    };
  }

  @Post('/signout')
  async signOut(@Req() request: RequestWithUser, @Res() response: Response) {
    return response.sendStatus(200);
  }
}
