import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import UserService from 'src/user/user.service';

@Module({
  controllers: [TaskController],
  providers: [UserService, TaskService, PrismaService, JwtService],
})
export class TaskModule {}
