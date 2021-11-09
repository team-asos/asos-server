import { IsNumber, IsString } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  name: string;

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
