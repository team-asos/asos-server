import { PartialType, PickType } from '@nestjs/swagger';

import { CreateRoomDto } from './create-room.dto';

export class SearchRoomDto extends PartialType(
  PickType(CreateRoomDto, ['floorId'] as const),
) {}
