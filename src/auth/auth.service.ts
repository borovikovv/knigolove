import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { UsersService } from '../users/users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { SignUpUserDto } from './dtos/signup.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SignInUserDto } from './dtos/signin.dto';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signup(userData: SignUpUserDto) {
    const { email, password, first_name, last_name, role } = userData;
    const users = await this.usersService.find(email);
    if (users.length) {
      throw new BadRequestException('This email already use');
    }

    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const result = `${salt}.${hash.toString('hex')}`;

    const user = await this.usersService.create(
      email,
      result,
      first_name,
      last_name,
      role,
    );

    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);

    if (!user) {
      throw new NotFoundException('Invalid login or password');
    }

    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Invalid login or password');
    }

    return user;
  }

  async validateUser(user: SignInUserDto) {
    const [foundUser] = await this.usersService.find(user.email);
    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(user.password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new UnauthorizedException('Invalid login or password');
    }
    const { password: _password, ...retUser } = foundUser;
    return retUser;
  }
}
