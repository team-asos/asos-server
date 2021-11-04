import { IsNumber, IsString } from 'class-validator';

export class CreateFacilityDto {
  @IsString()
  type: string;

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
  floorId: number;
}
