import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { User } from 'src/users/user.entity';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  year: string;

  @Column()
  publisher: string;

  @Column()
  img: string;

  @Column()
  rating: number;

  @Column()
  reviewers: User[];
}
