import { Module } from '@nestjs/common';
import { LeadService } from './lead.service';
import { LeadController } from './lead.controller';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import UserService from 'src/user/user.service';

@Module({
  controllers: [LeadController],
  providers: [UserService, LeadService, PrismaService, JwtService],
})
export class LeadModule {}
