import { OmitType } from '@nestjs/swagger';

import { CreateReservationDto } from './create-reservation.dto';

export class CreateRoomReservationDto extends OmitType(CreateReservationDto, [
  'seatId',
] as const) {}
