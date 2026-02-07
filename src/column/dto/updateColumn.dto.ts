import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateColumnDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  @IsOptional()
  name: string;

  @IsNotEmpty()
  @IsOptional()
  order: number;
}
