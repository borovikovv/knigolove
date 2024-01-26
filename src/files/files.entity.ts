import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class PublicFile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column()
  key: string;
}
