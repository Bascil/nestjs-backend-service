import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateLeadDto {
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
}
