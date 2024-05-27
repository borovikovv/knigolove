import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Book } from 'src/books/book.entity';
import { PublicFile } from 'src/files/files.entity';

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
  role: string;

  @Column({
    nullable: true,
  })
  @Exclude()
  public refrestToken?: string;

  @JoinColumn()
  @OneToOne(() => PublicFile, {
    eager: true,
    nullable: true,
  })
  public avatar?: PublicFile;

  @ManyToMany(() => Book, (book) => book.reviewers)
  @JoinTable()
  reviews?: Book[];
}
