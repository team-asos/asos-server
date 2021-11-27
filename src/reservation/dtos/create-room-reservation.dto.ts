import { IsDateString } from 'class-validator';

import { OmitType } from '@nestjs/swagger';

import { CreateReservationDto } from './create-reservation.dto';

export class CreateRoomReservationDto extends OmitType(CreateReservationDto, [
  'status',
  'seatId',
  'floorId',
] as const) {}
