import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/createProject.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from 'src/db.service';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async createProject(userId: number, data: CreateProjectDto) {
    const project = await this.prisma.project.create({
      data: {
        key: data.key,
        name: data.name,
        description: data.description,
        members: {
          create: {
            userId,
            role: 'admin',
          },
        },
      },
    });
    return project;
  }

  async addMember(projectId: number, email: string) {
    const member = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!member) {
      throw new NotFoundException('User not found');
    }
    const isAlreadyMember = await this.prisma.projectMember.findFirst({
      where: { projectId, userId: member.id },
    });
    if (isAlreadyMember) {
      throw new UnauthorizedException(
        'User is already a member of the project',
      );
    }
    const projectMember = await this.prisma.projectMember.create({
      data: {
        userId: member.id,
        projectId,
        role: 'member',
      },
    });
    return {
      ...projectMember,
      user: { name: member.name, email: member.email },
    };
  }

  async removeMember(projectId: number, userId: number) {
    const relationId = await this.prisma.projectMember.findFirst({
      where: { userId, projectId },
    });
    if (!relationId) {
      throw new NotFoundException('Member not found');
    }
    return this.prisma.projectMember.delete({
      where: {
        id: relationId.id,
      },
    });
  }

  async getAllUserProjects(userId: number) {
    const memberships = await this.prisma.projectMember.findMany({
      where: { userId },
      include: {
        project: {
          include: {
            _count: {
              select: { members: true, boards: true, issues: true },
            },
          },
        },
      },
    });
    return memberships;
  }

  async getProjectById(projectId: number, userId: number) {
    const member = await this.prisma.projectMember.findUnique({
      where: { userId_projectId: { userId, projectId } },
    });

    if (!member) {
      throw new UnauthorizedException('User is not a member of this project');
    }

    return this.prisma.project.findUnique({
      where: { id: projectId },
      include: {
        members: {
          include: {
            user: {
              select: { name: true, email: true },
            },
          },
        },
        boards: true,
      },
    });
  }

  async updateProject(
    projectId: number,
    userId: number,
    data: UpdateProjectDto,
  ) {
    const member = await this.prisma.projectMember.findUnique({
      where: {
        userId_projectId: { userId, projectId },
        role: 'admin',
      },
    });

    if (!member) {
      throw new UnauthorizedException('User is not an admin of this project');
    }

    return this.prisma.project.update({
      where: { id: projectId },
      data: {
        name: data.name,
        description: data.description,
        key: data.key,
      },
    });
  }

  async deleteProject(projectId: number, userId: number) {
    const member = await this.prisma.projectMember.findUnique({
      where: {
        userId_projectId: { userId, projectId },
        role: 'admin',
      },
    });

    if (!member) {
      throw new UnauthorizedException('User is not an admin of this project');
    }

    return this.prisma.project.delete({ where: { id: projectId } });
  }

  async getProjectMembers(projectId: number, userId: number) {
    const member = await this.prisma.projectMember.findUnique({
      where: { userId_projectId: { userId, projectId } },
    });

    if (!member) {
      throw new UnauthorizedException('User is not a member of this project');
    }

    return this.prisma.projectMember.findMany({
      where: { projectId },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }
}
