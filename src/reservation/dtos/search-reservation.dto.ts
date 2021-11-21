import { PartialType, PickType } from '@nestjs/swagger';

import { CreateReservationDto } from './create-reservation.dto';

export class SearchReservationDto extends PartialType(
  PickType(CreateReservationDto, [
    'userId',
    'seatId',
    'roomId',
    'floorId',
    'status',
  ] as const),
) {}
