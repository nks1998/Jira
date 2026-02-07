import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/db.service';
import { CreateSprintDto } from './dto/create-sprint.dto';
import { UpdateSprintDto } from './dto/update-sprint.dto';

@Injectable()
export class SprintsService {
  constructor(private prisma: PrismaService) {}

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

  async create(createSprintDto: CreateSprintDto, userId: number) {
    await this.verifyProjectAccess(createSprintDto.projectId, userId, true);
    return this.prisma.sprint.create({
      data: {
        name: createSprintDto.name,
        startDate: new Date(createSprintDto.startDate),
        endDate: new Date(createSprintDto.endDate),
        projectId: createSprintDto.projectId,
        isActive: createSprintDto.isActive ?? true,
      },
    });
  }

  async findAllByProjectId(projectId: number, userId: number) {
    await this.verifyProjectAccess(projectId, userId);
    return this.prisma.sprint.findMany({
      where: { projectId },
      include: {
        _count: {
          select: { issues: true },
        },
      },
      orderBy: { startDate: 'desc' },
    });
  }

  async findOne(id: number, userId: number) {
    const sprint = await this.prisma.sprint.findUnique({
      where: { id },
      include: {
        issues: {
          include: {
            assignee: {
              select: { id: true, name: true, email: true },
            },
          },
        },
      },
    });

    if (!sprint) {
      throw new NotFoundException('Sprint not found');
    }

    await this.verifyProjectAccess(sprint.projectId, userId);
    return sprint;
  }

  async update(id: number, updateSprintDto: UpdateSprintDto, userId: number) {
    const sprint = await this.prisma.sprint.findUnique({
      where: { id },
    });

    if (!sprint) {
      throw new NotFoundException('Sprint not found');
    }

    await this.verifyProjectAccess(sprint.projectId, userId, true);

    return this.prisma.sprint.update({
      where: { id },
      data: {
        name: updateSprintDto.name,
        startDate: updateSprintDto.startDate
          ? new Date(updateSprintDto.startDate)
          : undefined,
        endDate: updateSprintDto.endDate
          ? new Date(updateSprintDto.endDate)
          : undefined,
        isActive: updateSprintDto.isActive,
      },
    });
  }

  async delete(id: number, userId: number) {
    const sprint = await this.prisma.sprint.findUnique({
      where: { id },
    });

    if (!sprint) {
      throw new NotFoundException('Sprint not found');
    }

    await this.verifyProjectAccess(sprint.projectId, userId, true);
    return this.prisma.sprint.delete({ where: { id } });
  }

  async addIssueToSprint(sprintId: number, issueId: number, userId: number) {
    const sprint = await this.prisma.sprint.findUnique({
      where: { id: sprintId },
    });

    if (!sprint) {
      throw new NotFoundException('Sprint not found');
    }

    await this.verifyProjectAccess(sprint.projectId, userId);

    return this.prisma.issue.update({
      where: { id: issueId },
      data: { sprintId },
    });
  }

  async removeIssueFromSprint(issueId: number, userId: number) {
    const issue = await this.prisma.issue.findUnique({
      where: { id: issueId },
    });

    if (!issue) {
      throw new NotFoundException('Issue not found');
    }

    await this.verifyProjectAccess(issue.projectId, userId);

    return this.prisma.issue.update({
      where: { id: issueId },
      data: { sprintId: null },
    });
  }
}
