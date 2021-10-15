import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateFacilityDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  x: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  y: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  width: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  height: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  floorId: number;
}
