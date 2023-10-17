import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  // @Column()
  // first_name: string;

  // @Column()
  // last_name: string;

  // @Column()
  // role: number;

  // @Column()
  // preferences: string;

  // @Column()
  // status: number;
}