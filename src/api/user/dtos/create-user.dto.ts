import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  password: string;

  @IsString()
  tel: string;

  @IsString()
  employeeId: string;

  @IsString()
  department: string;

  @IsString()
  position: string;
}
