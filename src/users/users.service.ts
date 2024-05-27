import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { promisify } from 'util';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { FilesService } from 'src/files/files.service';

const scrypt = promisify(_scrypt);

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) public repo: Repository<User>,
    private readonly filesService: FilesService,
  ) {}

  create(
    email: string,
    password: string,
    first_name: string,
    last_name: string,
    role: string,
  ) {
    const user = this.repo.create({
      email,
      password,
      first_name,
      last_name,
      role,
    });

    return this.repo.save(user);
  }

  findOne(id: number) {
    return this.repo.findOneBy({ id });
  }

  findByEmail(email: string) {
    return this.repo.find({ where: { email } });
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.repo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found!');
    }
    Object.assign(user, attrs);

    return this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.repo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found!');
    }

    return this.repo.remove(user);
  }

  async getById(id: number) {
    const user = await this.repo.findOneBy({ id });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async addAvatar(userId: number, imageBuffer: Buffer, filename: string) {
    const avatar = await this.filesService.uploadPublicFiles(
      filename,
      imageBuffer,
    );
    const user = await this.getById(userId);
    await this.repo.update(userId, {
      ...user,
      avatar,
    });
    return avatar;
  }

  async setCurrentRefreshToken(refToken: string, userId: number) {
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(refToken, salt, 32)) as Buffer;
    const refrestToken = `${salt}.${hash.toString('hex')}`;
    await this.repo.update(userId, {
      refrestToken,
    });
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    const user = await this.getById(userId);

    if (!user) {
      throw new NotFoundException('Invalid login or password');
    }

    const [salt, storedHash] = user.refrestToken.split('.');
    const hash = (await scrypt(refreshToken, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Invalid session');
    }

    return user;
  }
}
