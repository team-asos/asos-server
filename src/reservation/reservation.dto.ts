import { IsArray, IsDate, IsNumber } from 'class-validator';

export class CreateRoomReservationDto {
  @IsDate()
  startTime: Date;

  @IsDate()
  endTime: Date;

  @IsNumber()
  status: number;

  @IsNumber()
  seatId?: number;

  @IsNumber()
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
  seatId?: number;

  @IsNumber()
  roomId?: number;

  @IsNumber()
  userId: number;
}
