import { IsEnum, IsNumber } from 'class-validator';

import { FacilityType } from '../enums/facility-type.enum';

export class CreateFacilityDto {
  @IsNumber()
  x: number;

  @IsNumber()
  y: number;

  @IsEnum(FacilityType, { each: true })
  type: FacilityType;

  @IsNumber()
  width: number;

  @IsNumber()
  height: number;

  @IsNumber()
  floorId: number;
}
