import { Injectable } from '@nestjs/common';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { PrismaService } from 'src/db.service';
import type { RequestWithUser } from 'src/auth/jwt-auth.guard';

@Injectable()
export class ProjectAdminGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<RequestWithUser>();

    const userId = req.user.sub;
    const projectId = Number(req.params.projectId);

    const member = await this.prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId,
          projectId,
        },
      },
    });

    return member?.role === 'admin';
  }
}
