import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/db.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  private async verifyIssueAccess(issueId: number, userId: number) {
    const issue = await this.prisma.issue.findUnique({
      where: { id: issueId },
    });
    if (!issue) {
      throw new NotFoundException('Issue not found');
    }

    const member = await this.prisma.projectMember.findUnique({
      where: {
        userId_projectId: { userId, projectId: issue.projectId },
      },
    });

    if (!member) {
      throw new UnauthorizedException('User is not a member of this project');
    }

    return issue;
  }

  async create(createCommentDto: CreateCommentDto, userId: number) {
    await this.verifyIssueAccess(createCommentDto.issueId, userId);
    return this.prisma.comment.create({
      data: {
        content: createCommentDto.content,
        issueId: createCommentDto.issueId,
        authorId: userId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findAllByIssueId(issueId: number, userId: number) {
    await this.verifyIssueAccess(issueId, userId);
    return this.prisma.comment.findMany({
      where: { issueId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async update(updateCommentDto: UpdateCommentDto, userId: number) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: updateCommentDto.id },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.authorId !== userId) {
      throw new UnauthorizedException('You can only edit your own comments');
    }

    return this.prisma.comment.update({
      where: { id: updateCommentDto.id },
      data: { content: updateCommentDto.content },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async delete(id: number, userId: number) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.authorId !== userId) {
      throw new UnauthorizedException('You can only delete your own comments');
    }

    return this.prisma.comment.delete({ where: { id } });
  }
}
