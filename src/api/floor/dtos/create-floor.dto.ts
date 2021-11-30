import { IsString, IsNumber } from 'class-validator';
export class CreateFloorDto {
  @IsString()
  name: string;

  @IsNumber()
  width: number;

  @IsNumber()
  height: number;
}
