import {
  Injectable,
  BadRequestException,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { UsersService } from '../users/users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { SignUpUserDto } from './dtos/signup.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from './dtos/signin.dto';

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
    const users = await this.usersService.findByEmail(email);
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
    const [user] = await this.usersService.findByEmail(email);

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

  async getAuthenticatedUser(email: string, plainTextPassword: string) {
    try {
      const [user] = await this.usersService.findByEmail(email);
      const [salt, storedHash] = user.password.split('.');
      const hash = (await scrypt(plainTextPassword, salt, 32)) as Buffer;

      if (storedHash !== hash.toString('hex')) {
        throw new BadRequestException('Invalid login or password');
      }

      return user;
    } catch (error) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async removeRefreshToken(userId: number) {
    return this.usersService.update(userId, {
      refrestToken: null,
    });
  }

  getJwtToken(userId: number) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: Number(this.configService.get('JWT_EXPIRATION_TIME')),
    });
    return token;
  }

  public getJwtRefreshToken(userId: number) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: Number(
        this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
      ),
    });
    return token;
  }
}
