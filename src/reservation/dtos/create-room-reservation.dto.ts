import { IsArray, IsDateString, IsNumber, IsOptional } from 'class-validator';

export class CreateRoomReservationDto {
  @IsDateString()
  startTime: Date;

  @IsDateString()
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
  @IsNumber({}, { each: true })
  participantIds: number[];
}
