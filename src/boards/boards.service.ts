import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { PrismaService } from 'src/db.service';

@Injectable()
export class BoardsService {
  constructor(private readonly prisma: PrismaService) {}

  async createBoard(userId: number, data: CreateBoardDto) {
    const member = await this.prisma.projectMember.findFirst({
      where: {
        userId,
        projectId: data.projectId,
        role: 'admin',
      },
    });
    if (!member) {
      throw new UnauthorizedException('Unauthorized');
    }
    return this.prisma.board.create({
      data: {
        name: data.name,
        projectId: data.projectId,
        description: data.description,
      },
    });
  }

  async getBoardByProjectId(projectId: number) {
    return this.prisma.board.findMany({
      where: {
        projectId,
      },
    });
  }

  async getUserBoards(userId: number) {
    return this.prisma.board.findMany({
      where: {
        project: {
          members: {
            some: {
              userId,
            },
          },
        },
      },
    });
  }

  async getBoardById(boardId: number) {
    return this.prisma.board.findUnique({
      where: {
        id: boardId,
      },
      include: {
        columns: {
          orderBy: { order: 'asc' },
          include: {
            issues: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });
  }

  async getAllColumnsByBoardId(boardId: number) {
    return this.prisma.column.findMany({
      where: {
        boardId,
      },
      include: {
        issues: {
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  async updateBoard(boardId: number, userId: number, data: UpdateBoardDto) {
    const board = await this.prisma.board.findUnique({
      where: { id: boardId },
    });

    if (!board) {
      throw new NotFoundException('Board not found');
    }

    const member = await this.prisma.projectMember.findFirst({
      where: {
        userId,
        projectId: board.projectId,
        role: 'admin',
      },
    });

    if (!member) {
      throw new UnauthorizedException('User is not an admin of this project');
    }

    return this.prisma.board.update({
      where: { id: boardId },
      data: { name: data.name },
    });
  }

  async deleteBoard(boardId: number, userId: number) {
    const board = await this.prisma.board.findUnique({
      where: { id: boardId },
    });

    if (!board) {
      throw new NotFoundException('Board not found');
    }

    const member = await this.prisma.projectMember.findFirst({
      where: {
        userId,
        projectId: board.projectId,
        role: 'admin',
      },
    });

    if (!member) {
      throw new UnauthorizedException('User is not an admin of this project');
    }

    return this.prisma.board.delete({ where: { id: boardId } });
  }
}
