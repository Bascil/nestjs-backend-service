import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  status: string;

  @IsNotEmpty()
  dueDate: Date;

  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  projectId: string;
}
