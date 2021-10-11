import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateRoomDto } from './room.dto';
import { Room } from './room.entity';
import { RoomService } from './room.service';

@ApiTags('rooms')
@Controller('rooms')
export class RoomController {
  constructor(private roomService: RoomService) {}

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: '모든 회의실 조회' })
  @ApiResponse({ status: 200, description: 'Success' })
  async findAll(): Promise<Room[]> {
    const rooms = await this.roomService.findAll();

    return rooms;
  }

  @Get(':roomId')
  @HttpCode(200)
  @ApiOperation({ summary: '특정 회의실 조회' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 404, description: 'Wrong roomId' })
  async findOne(@Param('roomId') roomId: number): Promise<Room> {
    const room = await this.roomService.findOne(roomId);

    return room;
  }

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: '회의실 생성' })
  @ApiResponse({ status: 201, description: 'Success' })
  async createOne(@Body() createRoomDto: CreateRoomDto): Promise<string> {
    await this.roomService.createOne(createRoomDto);

    return 'success';
  }
}
