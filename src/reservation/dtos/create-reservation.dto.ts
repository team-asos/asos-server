import { IsArray, IsDateString, IsNumber } from 'class-validator';

export class CreateReservationDto {
  @IsDateString()
  startTime: Date;

  @IsDateString()
  endTime: Date;

  @IsNumber()
  status: number;

  @IsNumber()
  userId: number;

  @IsNumber()
  seatId: number;

  @IsNumber()
  roomId: number;

  @IsArray()
  @IsNumber({}, { each: true })
  participantIds: number[];
}
