import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { IssuePriority, IssueType } from 'src/generated/prisma/enums';

export class CreateIssueDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsEnum(IssueType)
  @IsNotEmpty()
  type: IssueType;

  @IsEnum(IssuePriority)
  @IsOptional()
  priority: IssuePriority;

  @IsNumber()
  @IsNotEmpty()
  columnId: number;

  @IsNumber()
  @IsNotEmpty()
  boardId: number;

  @IsNumber()
  @IsOptional()
  assigneeId: number;
}
