import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './create-project.dto';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  status: string;

  @IsNotEmpty()
  startDate: Date;

  @IsOptional()
  endDate: Date;

  @IsOptional()
  createdAt: Date;

  @IsOptional()
  updatedAt: Date;

  @IsOptional()
  id: string;
}
