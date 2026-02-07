import { applyDecorators } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ProjectMemberGuard } from './project-memner.guard';

export function ProjectAuth() {
  return applyDecorators(UseGuards(JwtAuthGuard, ProjectMemberGuard));
}
