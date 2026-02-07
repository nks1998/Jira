import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import type { RequestWithUser } from 'src/auth/jwt-auth.guard';

@Controller('comments')
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(
    @Body() createCommentDto: CreateCommentDto,
    @Request() req: RequestWithUser,
  ) {
    return this.commentsService.create(createCommentDto, req.user.sub);
  }

  @Get()
  findAllByIssueId(
    @Query('issueId') issueId: string,
    @Request() req: RequestWithUser,
  ) {
    return this.commentsService.findAllByIssueId(Number(issueId), req.user.sub);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Request() req: RequestWithUser,
  ) {
    return this.commentsService.update(
      { ...updateCommentDto, id: Number(id) },
      req.user.sub,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.commentsService.delete(Number(id), req.user.sub);
  }
}
