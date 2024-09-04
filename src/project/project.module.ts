import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import UserService from 'src/user/user.service';

@Module({
  controllers: [ProjectController],
  providers: [UserService, ProjectService, PrismaService, JwtService],
})
export class ProjectModule {}
