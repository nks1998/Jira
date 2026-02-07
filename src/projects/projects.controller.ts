import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard, type RequestWithUser } from 'src/auth/jwt-auth.guard';
import { CreateProjectDto } from './dto/createProject.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectAdmin } from './guards/project-admin.decorator';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createProject(
    @Request() req: RequestWithUser,
    @Body() body: CreateProjectDto,
  ) {
    return this.projectsService.createProject(req.user.sub, body);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllUserProjects(@Request() req: RequestWithUser) {
    return this.projectsService.getAllUserProjects(req.user.sub);
  }

  @Get(':projectId')
  @UseGuards(JwtAuthGuard)
  async getProjectById(
    @Param('projectId') projectId: string,
    @Request() req: RequestWithUser,
  ) {
    return this.projectsService.getProjectById(Number(projectId), req.user.sub);
  }

  @Patch(':projectId')
  @ProjectAdmin()
  async updateProject(
    @Param('projectId') projectId: string,
    @Request() req: RequestWithUser,
    @Body() body: UpdateProjectDto,
  ) {
    return this.projectsService.updateProject(
      Number(projectId),
      req.user.sub,
      body,
    );
  }

  @Delete(':projectId')
  @ProjectAdmin()
  async deleteProject(
    @Param('projectId') projectId: string,
    @Request() req: RequestWithUser,
  ) {
    return this.projectsService.deleteProject(Number(projectId), req.user.sub);
  }

  @Get(':projectId/members')
  @UseGuards(JwtAuthGuard)
  async getProjectMembers(
    @Param('projectId') projectId: string,
    @Request() req: RequestWithUser,
  ) {
    return this.projectsService.getProjectMembers(
      Number(projectId),
      req.user.sub,
    );
  }

  @Post(':projectId/members')
  @ProjectAdmin()
  addMember(
    @Param('projectId') projectId: string,
    @Body() body: { email: string },
  ) {
    return this.projectsService.addMember(Number(projectId), body.email);
  }

  @Delete(':projectId/members/:userId')
  @ProjectAdmin()
  removeMember(
    @Param('projectId') projectId: string,
    @Param('userId') userId: string,
  ) {
    return this.projectsService.removeMember(Number(projectId), Number(userId));
  }
}
