import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/db.service';
import { CreateColumnDto } from './dto/createColumn.dto';
import { UpdateColumnDto } from './dto/updateColumn.dto';

@Injectable()
export class ColumnService {
  constructor(private prisma: PrismaService) {}

  private async verifyBoardAccess(
    boardId: number,
    userId: number,
    requireAdmin = false,
  ) {
    const board = await this.prisma.board.findUnique({
      where: { id: boardId },
    });
    if (!board) {
      throw new NotFoundException('Board not found');
    }

    const whereClause = requireAdmin
      ? {
          userId_projectId: { userId, projectId: board.projectId },
          role: 'admin',
        }
      : { userId_projectId: { userId, projectId: board.projectId } };

    const member = await this.prisma.projectMember.findUnique({
      where: whereClause,
    });

    if (!member) {
      const message = requireAdmin
        ? 'User is not an admin of this project'
        : 'User is not a member of this project';
      throw new UnauthorizedException(message);
    }

    return board;
  }

  async createColumn(data: CreateColumnDto, userId: number) {
    await this.verifyBoardAccess(data.boardId, userId, true);
    return this.prisma.column.create({ data });
  }

  async updateColumn(data: UpdateColumnDto, userId: number) {
    const column = await this.prisma.column.findUnique({
      where: { id: data.id },
    });
    if (!column) {
      throw new NotFoundException('Column not found');
    }
    await this.verifyBoardAccess(column.boardId, userId, true);
    return this.prisma.column.update({ where: { id: data.id }, data });
  }

  async deleteColumn(id: number, userId: number) {
    const column = await this.prisma.column.findUnique({
      where: { id },
    });
    if (!column) {
      throw new NotFoundException('Column not found');
    }
    await this.verifyBoardAccess(column.boardId, userId, true);
    const issues = await this.prisma.issue.findMany({
      where: { columnId: id },
    });
    if (issues.length > 0) {
      throw new UnauthorizedException('Column is not empty');
    }
    return this.prisma.column.delete({ where: { id } });
  }

  async getColumnsByBoardId(boardId: number, userId: number) {
    await this.verifyBoardAccess(boardId, userId, false);
    return this.prisma.column.findMany({
      where: { boardId },
      orderBy: { order: 'asc' },
    });
  }

  async getColumnById(id: number, userId: number) {
    await this.verifyBoardAccess(id, userId, false);
    return this.prisma.column.findUnique({ where: { id } });
  }
}
