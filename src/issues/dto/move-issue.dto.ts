import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class MoveIssueDto {
  @IsNumber()
  @IsNotEmpty()
  columnId: number;

  @IsNumber()
  @IsOptional()
  order?: number;
}
