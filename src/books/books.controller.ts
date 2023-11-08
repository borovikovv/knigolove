import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dtos/create-book.dto';
import { AuthGuard } from '../guards/auth.guard';

@Controller('books')
export class BooksController {
  constructor(private booksService: BooksService) {}

  @Post()
  @UseGuards(AuthGuard)
  createBook(@Body() body: CreateBookDto) {
    return this.booksService.create(body);
  }
}
