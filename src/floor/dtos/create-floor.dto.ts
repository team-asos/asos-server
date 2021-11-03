import { IsNumber } from 'class-validator';

export class CreateFloorDto {
  @IsNumber()
  floorId: number;
}
