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
import { RedisService } from 'src/redis/redis.service';
import { LoggedInGuard } from 'src/guards/logged-in.guard';
import { AdminGuard } from 'src/guards/admin.guard';
import { LocalGuard } from 'src/guards/local.guard';

@Controller('auth')
@Serialize(UserDto)
export class AuthController {
  constructor(
    private authService: AuthService,
    private redisService: RedisService,
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

  // @UseGuards(LocalGuard)
  @Post('/signin')
  async loginUser(@Req() req, @Body() { email, password }: SignInUserDto) {
    const user = await this.authService.signin(email, password);
    return user;
  }

  @Get('/set')
  async setRedis(@Req() request: RequestWithUser) {
    this.redisService.set('user', 'Alex', 1000000);
  }

  @Get('/get')
  async getRedis(@Req() request: RequestWithUser) {
    const user = await this.redisService.get('user');
    return user;
  }

  @Post('/signout')
  async signOut(@Req() request: RequestWithUser, @Res() response: Response) {
    return response.sendStatus(200);
  }

  @Get('/message')
  publicRoute() {
    return this.authService.getPublicMessage();
  }

  @UseGuards(LoggedInGuard)
  @Get('/protected')
  guardedRoute() {
    return this.authService.getPrivateMessage();
  }

  @UseGuards(AdminGuard)
  @Get('/admin')
  getAdminMessage() {
    return this.authService.getAdminMessage();
  }
}
