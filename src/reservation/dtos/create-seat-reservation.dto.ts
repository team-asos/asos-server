import { OmitType } from '@nestjs/swagger';

import { CreateReservationDto } from './create-reservation.dto';

export class CreateSeatReservationDto extends OmitType(CreateReservationDto, [
  'roomId',
  'participantIds',
] as const) {}
