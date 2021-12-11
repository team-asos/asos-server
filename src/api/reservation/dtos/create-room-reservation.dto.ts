import { OmitType } from '@nestjs/swagger';

import { CreateReservationDto } from './create-reservation.dto';

export class CreateRoomReservationDto extends OmitType(CreateReservationDto, [
  'status',
  'userId',
  'seatId',
  'floorId',
] as const) {}
