import { IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';

export class CreateBoardDto {
  @IsString()
  @MinLength(2)
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  projectId: number;
}
