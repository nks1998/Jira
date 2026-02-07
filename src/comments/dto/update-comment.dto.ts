import { PartialType } from '@nestjs/mapped-types';
import { CreateCommentDto } from './create-comment.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateCommentDto extends PartialType(CreateCommentDto) {
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
