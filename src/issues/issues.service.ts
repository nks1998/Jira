import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { MoveIssueDto } from './dto/move-issue.dto';
import { PrismaService } from 'src/db.service';

@Injectable()
export class IssuesService {
  constructor(private prisma: PrismaService) {}

  private async verifyIssueAccess(
    issueId: number,
    userId: number,
    requireAdmin = false,
  ) {
    const issue = await this.prisma.issue.findUnique({
      where: { id: issueId },
    });
    if (!issue) {
      throw new NotFoundException('Issue not found');
    }

    const whereClause = requireAdmin
      ? {
          userId_projectId: { userId, projectId: issue.projectId },
          role: 'admin',
        }
      : { userId_projectId: { userId, projectId: issue.projectId } };

    const member = await this.prisma.projectMember.findUnique({
      where: whereClause,
    });

    if (!member) {
      const message = requireAdmin
        ? 'User is not an admin of this project'
        : 'User is not a member of this project';
      throw new UnauthorizedException(message);
    }

    return issue;
  }

  private async verifyProjectAccess(
    projectId: number,
    userId: number,
    requireAdmin = false,
  ) {
    const whereClause = requireAdmin
      ? {
          userId_projectId: { userId, projectId },
          role: 'admin',
        }
      : { userId_projectId: { userId, projectId } };

    const member = await this.prisma.projectMember.findUnique({
      where: whereClause,
    });

    if (!member) {
      const message = requireAdmin
        ? 'User is not an admin of this project'
        : 'User is not a member of this project';
      throw new UnauthorizedException(message);
    }
  }
  async create(createIssueDto: CreateIssueDto, userId: number) {
    const board = await this.prisma.board.findUnique({
      where: { id: createIssueDto.boardId },
    });
    if (!board) {
      throw new NotFoundException('Board not found');
    }
    await this.verifyProjectAccess(board.projectId, userId);
    return this.prisma.issue.create({
      data: {
        ...createIssueDto,
        projectId: board.projectId,
      },
    });
  }

  async update(id: number, updateIssueDto: UpdateIssueDto, userId: number) {
    await this.verifyIssueAccess(id, userId);
    return this.prisma.issue.update({ where: { id }, data: updateIssueDto });
  }

  async delete(id: number, userId: number) {
    await this.verifyIssueAccess(id, userId, true);
    return this.prisma.issue.delete({ where: { id } });
  }

  async findByIssueId(id: number, userId: number) {
    await this.verifyIssueAccess(id, userId);
    return this.prisma.issue.findUnique({
      where: { id },
      include: {
        assignee: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  async findAllByBoardId(boardId: number, userId: number) {
    const board = await this.prisma.board.findUnique({
      where: { id: boardId },
    });
    if (!board) {
      throw new NotFoundException('Board not found');
    }
    await this.verifyProjectAccess(board.projectId, userId);
    return this.prisma.issue.findMany({
      where: { boardId },
      include: { assignee: { select: { id: true, name: true, email: true } } },
    });
  }

  async findAllByColumnId(columnId: number, userId: number) {
    const column = await this.prisma.column.findUnique({
      where: { id: columnId },
      include: { board: true },
    });
    if (!column) {
      throw new NotFoundException('Column not found');
    }
    await this.verifyProjectAccess(column.board.projectId, userId);
    return this.prisma.issue.findMany({
      where: { columnId },
      include: { assignee: true },
    });
  }

  async findAllByProjectId(projectId: number, userId: number) {
    await this.verifyProjectAccess(projectId, userId);
    return this.prisma.issue.findMany({
      where: { projectId },
      include: { assignee: { select: { id: true, name: true, email: true } } },
    });
  }

  async findAllByAssigneeId(assigneeId: number, userId: number) {
    const issues = await this.prisma.issue.findMany({
      where: { assigneeId },
      include: { project: true },
    });

    const userProjects = await this.prisma.projectMember.findMany({
      where: { userId },
      select: { projectId: true },
    });
    const projectIds = new Set(userProjects.map((p) => p.projectId));

    return issues.filter((issue) => projectIds.has(issue.projectId));
  }

  async moveIssue(issueId: number, moveIssueDto: MoveIssueDto, userId: number) {
    const issue = await this.verifyIssueAccess(issueId, userId);

    const column = await this.prisma.column.findUnique({
      where: { id: moveIssueDto.columnId },
      include: { board: true },
    });

    if (!column) {
      throw new NotFoundException('Column not found');
    }

    if (column.board.projectId !== issue.projectId) {
      throw new BadRequestException(
        'Column does not belong to the same project',
      );
    }

    const maxOrder = await this.prisma.issue.findFirst({
      where: { columnId: moveIssueDto.columnId },
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    const newOrder = moveIssueDto.order ?? (maxOrder?.order ?? 0) + 1;

    return this.prisma.issue.update({
      where: { id: issueId },
      data: {
        columnId: moveIssueDto.columnId,
        order: newOrder,
      },
    });
  }

  async reorderIssue(issueId: number, newOrder: number, userId: number) {
    await this.verifyIssueAccess(issueId, userId);

    return this.prisma.issue.update({
      where: { id: issueId },
      data: { order: newOrder },
    });
  }
}
