import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateSprintDto {
  @IsString()
  @MinLength(2)
  @IsNotEmpty()
  name: string;

  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @IsNumber()
  @IsNotEmpty()
  projectId: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
