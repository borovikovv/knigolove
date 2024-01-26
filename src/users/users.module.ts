import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { CurrectUserInterceptor } from './interceptors/currect-user.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { FilesModule } from 'src/files/files.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), FilesModule],
  providers: [
    UsersService,
    AuthService,
    { provide: APP_INTERCEPTOR, useClass: CurrectUserInterceptor },
  ],
  controllers: [UsersController],
})
export class UsersModule {}
