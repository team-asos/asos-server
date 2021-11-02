import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateRoomReservationDto } from './dtos/create-room-reservation.dto';
import { CreateSeatReservationDto } from './dtos/create-seat-reservation.dto';
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

  @Get(':reservationId')
  @HttpCode(200)
  @ApiOperation({ summary: '특정 예약 조회' })
  @ApiResponse({ status: 200, description: 'Success' })
  async findOne(
    @Param('reservationId') reservationId: number,
  ): Promise<Reservation> {
    const reservation = await this.reservationService.findOne(reservationId);

    return reservation;
  }

  @Post('room')
  @HttpCode(201)
  @ApiOperation({ summary: '회의실 예약 생성' })
  @ApiResponse({ status: 201, description: 'Success' })
  @ApiResponse({
    status: 400,
    description: 'Fail To Save Participant',
  })
  async createRoomOne(
    @Body() createRoomReservationDto: CreateRoomReservationDto,
  ): Promise<string> {
    await this.reservationService.createRoomOne(createRoomReservationDto);

    return 'success';
  }

  @Post('seat')
  @HttpCode(201)
  @ApiOperation({ summary: '좌석 예약 생성' })
  @ApiResponse({ status: 201, description: 'Success' })
  @ApiResponse({ status: 404, description: 'Wrong userId' })
  async createSeatOne(
    @Body() createSeatReservationDto: CreateSeatReservationDto,
  ): Promise<string> {
    await this.reservationService.createSeatOne(createSeatReservationDto);

    return 'success';
  }
}
