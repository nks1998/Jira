import { IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @MinLength(1)
  @IsNotEmpty()
  content: string;

  @IsNumber()
  @IsNotEmpty()
  issueId: number;
}
