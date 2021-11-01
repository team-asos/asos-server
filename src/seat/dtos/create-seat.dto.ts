import { IsNumber } from 'class-validator';

export class CreateSeatDto {
  @IsNumber()
  x: number;

  @IsNumber()
  y: number;

  @IsNumber()
  width: number;

  @IsNumber()
  height: number;

  @IsNumber()
  floorId: number;
}
