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
import { CurrectUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { LocalAuthGuard } from 'src/guards/auth.guard';

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
    response.setHeader('Set-Cookie', cookie);
    response.send(user);

    return user;
  }

  @Get('who')
  async whoIAm(@CurrectUser() user: User) {
    return user;
  }

  @UseGuards(LocalAuthGuard)
  @Post('/signout')
  async signOut(@Req() request: RequestWithUser, @Res() response: Response) {
    response.setHeader('Set-Cookie', this.authService.getCookieForLogOut());
    return response.sendStatus(200);
  }
}
