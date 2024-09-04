import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import UserService from 'src/user/user.service';

@Module({
  controllers: [CustomerController],
  providers: [UserService, CustomerService, PrismaService, JwtService],
})
export class CustomerModule {}
