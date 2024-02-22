import {
  Controller,
  Post,
  Body,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dtos/create-book.dto';
import { LocalAuthGuard } from '../guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('books')
export class BooksController {
  constructor(private booksService: BooksService) {}

  @Post('/create')
  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(LocalAuthGuard)
  createBook(
    @Body() body: CreateBookDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log(file, 'file');
    console.log(body, 'body');
    // return this.booksService.create(body);
  }
}
