import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthService } from '../auth/auth.service';
import { User } from './user.entity';
import { CurrectUserInterceptor } from './interceptors/currect-user.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { FilesModule } from 'src/files/files.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([User]), FilesModule, JwtModule],
  providers: [
    UsersService,
    AuthService,
    { provide: APP_INTERCEPTOR, useClass: CurrectUserInterceptor },
  ],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
