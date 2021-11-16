import { PartialType, PickType } from '@nestjs/swagger';

import { CreateFacilityDto } from './create-facility.dto';

export class SearchFacilityDto extends PartialType(
  PickType(CreateFacilityDto, ['floorId'] as const),
) {}
