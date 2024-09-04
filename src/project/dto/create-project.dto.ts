import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateProjectDto {
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
}
