import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/common/roles/role.enum';
import { Roles } from 'src/common/roles/roles.decorator';

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

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

  @Get('search')
  @HttpCode(200)
  @ApiQuery({
    name: 'userId',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'floorId',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'status',
    required: false,
    type: Number,
  })
  @ApiResponse({ status: 200, description: 'Success' })
  async searchAll(@Query() search): Promise<Reservation[]> {
    const reservations = await this.reservationService.searchAll(search);

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

  @ApiQuery({
    name: 'date',
    required: false,
    type: Date,
  })
  @Get('room/:roomId/table')
  @HttpCode(200)
  @ApiOperation({ summary: '회의실 예약 테이블 조회' })
  @ApiResponse({ status: 200, description: 'Success' })
  async findRoomTable(
    @Param('roomId') roomId: number,
    @Query() search,
  ): Promise<Reservation[]> {
    const table = await this.reservationService.findRoomTable(roomId, search);

    return table;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  @Post('room')
  @HttpCode(201)
  @ApiOperation({ summary: '회의실 예약 생성' })
  @ApiResponse({ status: 201, description: 'Success' })
  @ApiResponse({
    status: 400,
    description: 'Fail To Save Participant',
  })
  async createRoomOne(
    @Req() req: any,
    @Body() createRoomReservationDto: CreateRoomReservationDto,
  ): Promise<string> {
    await this.reservationService.createRoomOne(
      req.user.id,
      createRoomReservationDto,
    );

    return 'success';
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  @Post('seat')
  @HttpCode(201)
  @ApiOperation({ summary: '좌석 사용 시작' })
  @ApiResponse({ status: 201, description: 'Success' })
  @ApiResponse({ status: 404, description: 'Wrong userId OR Wrong seatId' })
  async createSeatOne(
    @Req() req: any,
    @Body() createSeatReservationDto: CreateSeatReservationDto,
  ): Promise<Reservation> {
    const reservation = await this.reservationService.createSeatOne(
      req.user.id,
      createSeatReservationDto,
    );

    return reservation;
  }

  @Patch(':reservationId/seat')
  @HttpCode(200)
  @ApiOperation({ summary: '좌석 사용 종료' })
  @ApiResponse({ status: 201, description: 'Success' })
  @ApiResponse({ status: 404, description: 'Wrong reservationId' })
  async updateSeatOne(
    @Param('reservationId') reservationId: number,
  ): Promise<string> {
    await this.reservationService.updateSeatOne(reservationId);

    return 'success';
  }

  @Delete(':reservationId')
  @HttpCode(200)
  @ApiOperation({ summary: '특정 예약 삭제' })
  @ApiResponse({ status: 201, description: 'Success' })
  @ApiResponse({ status: 404, description: 'Wrong userId' })
  async deleteOne(
    @Param('reservationId') reservationId: number,
  ): Promise<string> {
    await this.reservationService.deleteOne(reservationId);

    return 'success';
  }
}
