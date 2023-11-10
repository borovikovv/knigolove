import { IsString, IsOptional } from 'class-validator';

export class CreateBookDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  year: number;

  @IsString()
  @IsOptional()
  publisher: string;
}
