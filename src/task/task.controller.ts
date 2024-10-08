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
  Put,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { RolesGuard } from '../role/guards/roles.guard';
import { Roles } from '../role/role.decorator';
import { Role } from '../role/enums/role.enum';

@Controller({
  path: 'tasks',
  version: '1',
})
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.Admin, Role.Manager, Role.Engineer)
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.createTask(createTaskDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.Admin, Role.Manager, Role.Engineer)
  findAll(@Query('page') page = 1, @Query('perPage') limit = 10) {
    return this.taskService.findAll(+page, +limit);
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.Admin, Role.Manager, Role.Engineer)
  findOne(@Param('id') id: string) {
    return this.taskService.getTaskById(id);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.Admin, Role.Manager, Role.Engineer)
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.updateTask(id, updateTaskDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.Admin, Role.Manager, Role.Engineer)
  @Roles(Role.Admin, Role.Manager)
  remove(@Param('id') id: string) {
    return this.taskService.deleteTask(id);
  }
}
