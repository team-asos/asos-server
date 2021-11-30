import { PartialType, PickType } from '@nestjs/swagger';

import { CreateSeatDto } from './create-seat.dto';

export class SearchSeatDto extends PartialType(
  PickType(CreateSeatDto, ['floorId'] as const),
) {}
