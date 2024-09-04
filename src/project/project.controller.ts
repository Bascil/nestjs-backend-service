import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { RolesGuard } from '../role/guards/roles.guard';
import { Roles } from '../role/role.decorator';
import { Role } from '../role/enums/role.enum';

@Controller({
  path: 'projects',
  version: '1',
})
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectService.createProject(createProjectDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.Admin, Role.Manager)
  findAll(@Query('page') page = 1, @Query('perPage') limit = 10) {
    return this.projectService.findAll(page, limit);
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.Admin, Role.Manager)
  findOne(@Param('id') id: string) {
    return this.projectService.getProjectById(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.Admin, Role.Manager)
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectService.updateProject(id, updateProjectDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.Admin, Role.Manager)
  remove(@Param('id') id: string) {
    return this.projectService.deleteProject(id);
  }
}
