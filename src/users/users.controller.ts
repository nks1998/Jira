import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import type { RequestWithUser } from 'src/auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllUsers(
    @Request() req: RequestWithUser,
    @Query('projectId') projectId?: string,
  ) {
    return this.usersService.getAllUsers(
      req.user.sub,
      projectId ? Number(projectId) : undefined,
    );
  }

  @Get('/profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req: RequestWithUser) {
    return this.usersService.findUserById(req.user.sub);
  }

  @Get('/email')
  async getUserByUsername(@Query('email') email: string) {
    return this.usersService.getUserByUsername(email);
  }
}
