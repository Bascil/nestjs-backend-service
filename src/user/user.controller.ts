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
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesGuard } from '../role/guards/roles.guard';
import { Roles } from '../role/role.decorator';
import { Role } from '../role/enums/role.enum';

@Controller({
  path: 'users',
  version: '1',
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.Admin, Role.Manager)
  findAll(@Query('page') page = 1, @Query('perPage') limit = 10) {
    return this.userService.findAll(+page, +limit);
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.Admin, Role.Manager)
  findOne(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.Admin, Role.Manager)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.Admin, Role.Manager)
  remove(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
