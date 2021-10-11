import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateSeatDto } from './seat.dto';
import { Seat } from './seat.entity';
import { SeatService } from './seat.service';

@ApiTags('seats')
@Controller('seats')
export class SeatController {
  constructor(private readonly seatService: SeatService) {}

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: '모든 좌석 조회' })
  @ApiResponse({ status: 200, description: 'Success' })
  async findAll(): Promise<Seat[]> {
    const seats = await this.seatService.findAll();

    return seats;
  }

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: '좌석 생성' })
  @ApiResponse({ status: 201, description: 'Success' })
  @ApiResponse({ status: 404, description: 'Wrong seatId' })
  async createOne(@Body() createSeatDto: CreateSeatDto): Promise<string> {
    await this.seatService.createOne(createSeatDto);
    return 'success';
  }

  @Delete(':seatId')
  @HttpCode(200)
  @ApiOperation({ summary: '좌석 삭제' })
  @ApiResponse({ status: 200, description: 'Success' })
  async deleteOne(@Param('seatId') seatId: number): Promise<string> {
    await this.seatService.deleteOne(seatId);

    return 'success';
  }
}
