import { Entity, Column, PrimaryGeneratedColumn} from 'typeorm';

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
}