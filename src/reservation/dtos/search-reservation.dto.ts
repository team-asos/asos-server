import { IsNumber, IsOptional } from 'class-validator';

import { PartialType, PickType } from '@nestjs/swagger';

import { CreateReservationDto } from './create-reservation.dto';

export class SearchReservationDto extends PartialType(
  PickType(CreateReservationDto, ['userId', 'status'] as const),
) {
  @IsNumber()
  @IsOptional()
  floorId?: number;
}
