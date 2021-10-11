import { IsNotEmpty, IsNumber } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateRoomDto {
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
  maxUser: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  floorId: number;
}
