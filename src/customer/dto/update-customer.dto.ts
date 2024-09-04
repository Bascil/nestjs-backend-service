import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomerDto } from './create-customer.dto';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  phoneNumber: string;

  @IsOptional()
  address: string;

  @IsOptional()
  id: string;

  @IsOptional()
  createdAt: Date;

  @IsOptional()
  updatedAt: Date;
}
