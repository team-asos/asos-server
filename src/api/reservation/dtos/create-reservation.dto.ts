import { IsArray, IsDateString, IsNumber, IsString } from 'class-validator';

export class CreateReservationDto {
  @IsDateString()
  startTime: Date;

  @IsDateString()
  endTime: Date;

  @IsString()
  topic: string;

  @IsNumber()
  status: number;

  @IsNumber()
  userId: number;

  @IsNumber()
  seatId: number;

  @IsNumber()
  roomId: number;

  @IsNumber()
  floorId: number;

  @IsArray()
  @IsNumber({}, { each: true })
  participantIds: number[];
}
