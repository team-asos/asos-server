import { IsDateString } from 'class-validator';

import { OmitType } from '@nestjs/swagger';

import { CreateReservationDto } from './create-reservation.dto';

export class CreateSeatReservationDto extends OmitType(CreateReservationDto, [
  'startTime',
  'endTime',
  'status',
  'roomId',
  'floorId',
  'participantIds',
] as const) {
  @IsDateString()
  startTime: Date;
}
