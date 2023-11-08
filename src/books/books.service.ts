import { Injectable } from '@nestjs/common';
import { Book } from './book.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBookDto } from './dtos/create-book.dto';

@Injectable()
export class BooksService {
  constructor(@InjectRepository(Book) public repo: Repository<Book>) {}

  create(bookDto: CreateBookDto) {
    const book = this.repo.create(bookDto);
    return this.repo.save(book);
  }
}
