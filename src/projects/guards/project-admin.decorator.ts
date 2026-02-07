import { applyDecorators } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ProjectAdminGuard } from './project-admin.guard';

export function ProjectAdmin() {
  return applyDecorators(UseGuards(JwtAuthGuard, ProjectAdminGuard));
}
