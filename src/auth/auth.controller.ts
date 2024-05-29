import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  UseGuards,
  HttpCode,
  Get,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from '../auth/auth.service';
import { Serialize } from 'src/interceptops';
import { RequestWithUser, SignInUserDto } from './dtos/signin.dto';
import { UserDto } from 'src/users/dtos/user.dto';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { LocalAuthenticationGuard } from 'src/guards/local.guard';
import JwtRefreshGuard from 'src/guards/jwt-refresh.guard';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
@Serialize(UserDto)
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

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
    const token = this.authService.getJwtToken(user.id);
    const refreshToken = this.authService.getJwtRefreshToken(user.id);
    return {
      ...user,
      token,
      refreshToken,
    };
  }

  @Post('/signout')
  async signOut(@Req() request: RequestWithUser, @Res() response: Response) {
    await this.authService.removeRefreshToken(request.user.id);
    return response.sendStatus(200);
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(@Req() request: RequestWithUser) {
    const refreshToken = this.authService.getJwtRefreshToken(request.user.id);
    const token = this.authService.getJwtToken(request.user.id);
    const accessTokenCookie = `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_EXPIRATION_TIME',
    )}`;
    const refreshTokenCookie = `Refresh=${refreshToken}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
    )}`;

    request.res.setHeader('Set-Cookie', [
      accessTokenCookie,
      refreshTokenCookie,
    ]);
    return request.user;
  }
}
