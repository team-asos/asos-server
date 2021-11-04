import { PartialType } from '@nestjs/swagger';

import { CreateFloorDto } from './create-floor.dto';

export class UpdateFloorDto extends PartialType(CreateFloorDto) {}
