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
import { LeadService } from './lead.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { RolesGuard } from '../role/guards/roles.guard';
import { Roles } from '../role/role.decorator';
import { Role } from '../role/enums/role.enum';

@Controller({
  path: 'leads',
  version: '1',
})
export class LeadController {
  constructor(private readonly leadService: LeadService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  create(@Body() createLeadDto: CreateLeadDto) {
    return this.leadService.createLead(createLeadDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.Admin, Role.Manager)
  findAll(@Query('page') page = 1, @Query('perPage') limit = 10) {
    return this.leadService.findAll(page, limit);
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.Admin, Role.Manager)
  findOne(@Param('id') id: string) {
    return this.leadService.getLeadById(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.Admin, Role.Manager)
  update(@Param('id') id: string, @Body() updateLeadDto: UpdateLeadDto) {
    return this.leadService.updateLead(id, updateLeadDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.Admin, Role.Manager)
  remove(@Param('id') id: string) {
    return this.leadService.deleteLead(id);
  }
}
