import { IsString, IsNumber } from 'class-validator';

export class CreateBookDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  year: number;

  @IsString()
  publisher: string;

  @IsString()
  img: string;
}
