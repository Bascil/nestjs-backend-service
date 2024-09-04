import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { PrismaService } from 'src/prisma.service';
import { UserModule } from 'src/user/user.module';
import UserService from 'src/user/user.service';

@Module({
  controllers: [RoleController],
  providers: [UserService, RoleService, PrismaService],
})
export class RoleModule {}
