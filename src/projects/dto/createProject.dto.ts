import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateProjectDto {
  @MinLength(3)
  @MaxLength(20)
  @IsString()
  key: string;

  @MinLength(3)
  @MaxLength(20)
  @IsString()
  name: string;

  @IsString()
  @MaxLength(255)
  description?: string;
}
