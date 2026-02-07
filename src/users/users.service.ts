import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db.service';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async findUserByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({ where: { email } });
    if (!user) {
      return null;
    }
    const userIsAdminProjects = await this.prismaService.projectMember.findMany(
      {
        where: { userId: user?.id, role: 'admin' },
      },
    );
    const boards = await this.prismaService.board.findMany({
      where: {
        project: {
          members: {
            some: {
              userId: user.id,
            },
          },
        },
      },
    });
    return {
      ...user,
      isAdmin: userIsAdminProjects.length > 0,
      boards,
    };
  }

  async createUser(email: string, password: string, name: string) {
    const user = await this.prismaService.user.create({
      data: {
        email,
        password,
        name,
      },
    });
    return { ...user, isAdmin: false, boards: [] };
  }

  async findUserById(id: number) {
    return this.prismaService.user.findUnique({
      where: { id },
      omit: { password: true },
    });
  }

  async getAllUsers(userId: number, projectId?: number) {
    if (projectId) {
      const member = await this.prismaService.projectMember.findUnique({
        where: { userId_projectId: { userId, projectId } },
      });

      if (!member) {
        return [];
      }

      const members = await this.prismaService.projectMember.findMany({
        where: { projectId },
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
      });

      return members.map((m) => m.user);
    }

    return this.prismaService.user.findMany({
      select: { id: true, name: true, email: true },
    });
  }

  async getUserByUsername(email: string) {
    return this.findUserByEmail(email);
  }
}
