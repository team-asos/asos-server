import { IsArray, IsNumber } from 'class-validator';

export class CreateReservationDto {
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
