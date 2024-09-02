import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Permission } from '../auth/permission/permission.decorator';

@Controller({
  path: 'users',
  version: '1',
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Permission('manage_system')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @Permission('manage_system')
  findAll() {
    return this.userService.findAll();
  }

  @Get('permission/:id')
  @Permission('manage_system')
  permissin(@Param('id') id: string) {
    return this.userService.getUserPermissions(id);
  }

  @Get(':id')
  @Permission('manage_system')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @Permission('manage_system')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Permission('manage_system')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
