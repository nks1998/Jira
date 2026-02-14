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
import { SprintsService } from './sprints.service';
import { CreateSprintDto } from './dto/create-sprint.dto';
import { UpdateSprintDto } from './dto/update-sprint.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import type { RequestWithUser } from 'src/auth/jwt-auth.guard';

@Controller('sprints')
@UseGuards(JwtAuthGuard)
export class SprintsController {
  constructor(private readonly sprintsService: SprintsService) {}

  @Post()
  create(
    @Body() createSprintDto: CreateSprintDto,
    @Request() req: RequestWithUser,
  ) {
    return this.sprintsService.create(createSprintDto, req.user.sub);
  }

  @Get()
  findAllByProjectId(@Query() query: string, @Request() req: RequestWithUser) {
    return this.sprintsService.findAllByQuery(query, req.user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.sprintsService.findOne(Number(id), req.user.sub);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSprintDto: UpdateSprintDto,
    @Request() req: RequestWithUser,
  ) {
    return this.sprintsService.update(
      Number(id),
      updateSprintDto,
      req.user.sub,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.sprintsService.delete(Number(id), req.user.sub);
  }

  @Post(':sprintId/issues/:issueId')
  addIssueToSprint(
    @Param('sprintId') sprintId: string,
    @Param('issueId') issueId: string,
    @Request() req: RequestWithUser,
  ) {
    return this.sprintsService.addIssueToSprint(
      Number(sprintId),
      Number(issueId),
      req.user.sub,
    );
  }

  @Delete('issues/:issueId')
  removeIssueFromSprint(
    @Param('issueId') issueId: string,
    @Request() req: RequestWithUser,
  ) {
    return this.sprintsService.removeIssueFromSprint(
      Number(issueId),
      req.user.sub,
    );
  }
}
