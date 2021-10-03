import { IsArray, IsDate, IsNumber, IsOptional } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateRoomReservationDto {
  @ApiProperty()
  @IsDate()
  startTime: Date;

  @ApiProperty()
  @IsDate()
  endTime: Date;

  @ApiProperty()
  @IsNumber()
  status: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  seatId: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  roomId: number;

  @ApiProperty()
  @IsNumber()
  userId: number;

  @ApiProperty()
  @IsArray()
  participantIds: number[];
}
export class CreateSeatReservationDto {
  @ApiProperty()
  @IsDate()
  startTime: Date;

  @ApiProperty()
  @IsDate()
  endTime: Date;

  @ApiProperty()
  @IsNumber()
  status: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  seatId: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  roomId: number;

  @ApiProperty()
  @IsNumber()
  userId: number;
}
