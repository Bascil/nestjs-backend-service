import { PartialType } from '@nestjs/mapped-types';
import { CreateLeadDto } from './create-lead.dto';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateLeadDto extends PartialType(CreateLeadDto) {
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

  @IsNotEmpty()
  source: string;

  @IsOptional()
  id: string;

  @IsOptional()
  createdAt: Date;

  @IsOptional()
  updatedAt: Date;
}
