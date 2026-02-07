import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import type { RequestWithUser } from 'src/auth/jwt-auth.guard';

@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createBoard(
    @Request() req: RequestWithUser,
    @Body() body: CreateBoardDto,
  ) {
    return this.boardsService.createBoard(req.user.sub, body);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUserBoards(@Request() req: RequestWithUser) {
    return this.boardsService.getUserBoards(req.user.sub);
  }

  @Get(':boardId')
  @UseGuards(JwtAuthGuard)
  async getUserBoardsById(@Param('boardId') boardId: string) {
    return this.boardsService.getBoardById(Number(boardId));
  }

  @Get(':boardId/columns')
  @UseGuards(JwtAuthGuard)
  async getAllColumnsByBoardId(@Param('boardId') boardId: string) {
    return this.boardsService.getAllColumnsByBoardId(Number(boardId));
  }

  @Patch(':boardId')
  @UseGuards(JwtAuthGuard)
  async updateBoard(
    @Param('boardId') boardId: string,
    @Request() req: RequestWithUser,
    @Body() body: UpdateBoardDto,
  ) {
    return this.boardsService.updateBoard(Number(boardId), req.user.sub, body);
  }

  @Delete(':boardId')
  @UseGuards(JwtAuthGuard)
  async deleteBoard(
    @Param('boardId') boardId: string,
    @Request() req: RequestWithUser,
  ) {
    return this.boardsService.deleteBoard(Number(boardId), req.user.sub);
  }
}
