import { IsNumber, IsString, IsEnum, NotEquals } from 'class-validator';
import { FacilityType } from '../facility.entity';
export class CreateFacilityDto {
  @IsEnum(FacilityType)
  @NotEquals(FacilityType)
  type: FacilityType;

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
