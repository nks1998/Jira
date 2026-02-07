import {
  Controller,
  Get,
  Query,
  UseGuards,
  Request,
  Body,
  Post,
  Patch,
  Delete,
} from '@nestjs/common';
import { ColumnService } from './column.service';
import * as jwtAuthGuard from 'src/auth/jwt-auth.guard';
import { CreateColumnDto } from './dto/createColumn.dto';
import { UpdateColumnDto } from './dto/updateColumn.dto';

@Controller('column')
@UseGuards(jwtAuthGuard.JwtAuthGuard)
export class ColumnController {
  constructor(private readonly columnService: ColumnService) {}

  @Get()
  async getColumnsByBoardId(
    @Query('boardId') boardId: number,
    @Request() req: jwtAuthGuard.RequestWithUser,
  ) {
    return this.columnService.getColumnsByBoardId(boardId, req.user.sub);
  }

  @Post()
  async createColumn(
    @Request() req: jwtAuthGuard.RequestWithUser,
    @Body() body: CreateColumnDto,
  ) {
    return this.columnService.createColumn(body, req.user.sub);
  }

  @Patch()
  async updateColumn(
    @Request() req: jwtAuthGuard.RequestWithUser,
    @Body() body: UpdateColumnDto,
  ) {
    return this.columnService.updateColumn(body, req.user.sub);
  }

  @Delete()
  async deleteColumn(
    @Request() req: jwtAuthGuard.RequestWithUser,
    @Body() body: UpdateColumnDto,
  ) {
    return this.columnService.deleteColumn(body.id, req.user.sub);
  }
}
