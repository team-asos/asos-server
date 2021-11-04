import { IsNumber, IsString } from 'class-validator';

export class CreateFloorDto {
  @IsNumber()
  floorId: number;

  @IsString()
  name: string;
}
