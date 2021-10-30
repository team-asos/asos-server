import { IsArray, IsDate, IsNumber, IsOptional } from 'class-validator';

export class CreateRoomReservationDto {
  @IsDate()
  startTime: Date;

  @IsDate()
  endTime: Date;

  @IsNumber()
  status: number;

  @IsNumber()
  @IsOptional()
  seatId?: number;

  @IsNumber()
  @IsOptional()
  roomId?: number;

  @IsNumber()
  userId: number;

  @IsArray()
  participantIds: number[];
}
export class CreateSeatReservationDto {
  @IsDate()
  startTime: Date;

  @IsDate()
  endTime: Date;

  @IsNumber()
  status: number;

  @IsNumber()
  @IsOptional()
  seatId?: number;

  @IsNumber()
  @IsOptional()
  roomId?: number;

  @IsNumber()
  userId: number;
}
