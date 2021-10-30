import { IsNumber } from 'class-validator';

export class CreateRoomDto {
  @IsNumber()
  x: number;

  @IsNumber()
  y: number;

  @IsNumber()
  width: number;

  @IsNumber()
  height: number;

  @IsNumber()
  maxUser: number;

  @IsNumber()
  floorId: number;
}
