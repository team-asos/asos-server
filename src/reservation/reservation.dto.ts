import { IsNumber } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateReservationDto {
  @ApiProperty()
  @IsNumber()
  userId: number;
}
