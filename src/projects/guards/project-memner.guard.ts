import { ExecutionContext, Injectable } from '@nestjs/common';
import { CanActivate } from '@nestjs/common';
import { PrismaService } from 'src/db.service';
import type { RequestWithUser } from 'src/auth/jwt-auth.guard';

@Injectable()
export class ProjectMemberGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<RequestWithUser>();

    const userId = req.user.sub;
    const projectId = Number(req.params.projectId);

    if (!projectId) return false;

    const member = await this.prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId,
          projectId,
        },
      },
    });

    return !!member;
  }
}
