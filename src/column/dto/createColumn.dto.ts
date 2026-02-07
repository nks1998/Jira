import { IsNotEmpty, MinLength } from 'class-validator';

export class CreateColumnDto {
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @IsNotEmpty()
  boardId: number;

  @IsNotEmpty()
  order: number;
}
