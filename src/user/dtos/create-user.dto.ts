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
  employee_id: string;

  @IsString()
  department: string;

  @IsString()
  position: string;
}
