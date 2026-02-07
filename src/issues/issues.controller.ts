import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { IssuesService } from './issues.service';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { MoveIssueDto } from './dto/move-issue.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import type { RequestWithUser } from 'src/auth/jwt-auth.guard';

@Controller('issues')
export class IssuesController {
  constructor(private readonly issuesService: IssuesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createIssueDto: CreateIssueDto,
    @Request() req: RequestWithUser,
  ) {
    return this.issuesService.create(createIssueDto, req.user.sub);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAllByBoardId(
    @Request() req: RequestWithUser,
    @Query('boardId') boardId: string,
  ) {
    return this.issuesService.findAllByBoardId(Number(boardId), req.user.sub);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.issuesService.findByIssueId(+id, req.user.sub);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateIssueDto: UpdateIssueDto,
    @Request() req: RequestWithUser,
  ) {
    return this.issuesService.update(+id, updateIssueDto, req.user.sub);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.issuesService.delete(+id, req.user.sub);
  }

  @Patch(':id/move')
  @UseGuards(JwtAuthGuard)
  moveIssue(
    @Param('id') id: string,
    @Body() moveIssueDto: MoveIssueDto,
    @Request() req: RequestWithUser,
  ) {
    return this.issuesService.moveIssue(+id, moveIssueDto, req.user.sub);
  }

  @Patch(':id/reorder')
  @UseGuards(JwtAuthGuard)
  reorderIssue(
    @Param('id') id: string,
    @Body() body: { order: number },
    @Request() req: RequestWithUser,
  ) {
    return this.issuesService.reorderIssue(+id, body.order, req.user.sub);
  }
}
