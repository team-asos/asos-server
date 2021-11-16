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
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateSeatDto } from './dtos/create-seat.dto';
import { UpdateSeatDto } from './dtos/update-seat.dto';
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

  @Get('search')
  @HttpCode(200)
  @ApiOperation({ summary: '검색한 좌석 조회' })
  @ApiQuery({
    name: 'floorId',
    required: false,
    type: Number,
  })
  @ApiResponse({ status: 200, description: 'Success' })
  async searchAll(@Query() search): Promise<Seat[]> {
    const seats = await this.seatService.searchAll(search);

    return seats;
  }

  @Get(':seatId')
  @HttpCode(200)
  @ApiOperation({ summary: '특정 좌석 조회' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 404, description: 'Wrong seatId' })
  async findOne(@Param('seatId') seatId: number): Promise<Seat> {
    const seat = await this.seatService.findOne(seatId);

    return seat;
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

  @Patch(':seatId')
  @HttpCode(200)
  @ApiOperation({ summary: '특정 좌석 수정' })
  @ApiResponse({ status: 200, description: 'Success' })
  async updateOne(
    @Param('seatId') seatId: number,
    @Body() updateSeatDto: UpdateSeatDto,
  ): Promise<string> {
    await this.seatService.updateOne(seatId, updateSeatDto);

    return 'success';
  }

  @Delete(':seatId')
  @HttpCode(200)
  @ApiOperation({ summary: '특정 좌석 삭제' })
  @ApiResponse({ status: 200, description: 'Success' })
  async deleteOne(@Param('seatId') seatId: number): Promise<string> {
    await this.seatService.deleteOne(seatId);

    return 'success';
  }
}
