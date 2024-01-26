import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { BooksModule } from './books/books.module';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { Book } from './books/book.entity';
import { FilesModule } from './files/files.module';
import { PublicFile } from './files/files.entity';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'images'),
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [User, Book, PublicFile],
      synchronize: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    BooksModule,
    UsersModule,
    FilesModule,
  ],
})
export class AppModule {}
