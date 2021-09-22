import { Controller, Get, HttpCode, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateReservationDto } from './reservation.dto';
import { Reservation } from './reservation.entity';
import { ReservationService } from './reservation.service';

@ApiTags('reservations')
@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: '모든 예약 조회' })
  @ApiResponse({ status: 200, description: 'Success' })
  async findAll(): Promise<Reservation[]> {
    const reservations = await this.reservationService.findAll();

    return reservations;
  }

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: '모든 예약 조회' })
  @ApiResponse({ status: 200, description: 'Success' })
  async createOne(createReservationDto: CreateReservationDto): Promise<string> {
    await this.reservationService.createOne(createReservationDto);

    return 'success';
  }
}
