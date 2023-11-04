import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Book } from 'src/books/book.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  role: number;

  @Column()
  status: number;

  @Column()
  reviews: Book[];
}
