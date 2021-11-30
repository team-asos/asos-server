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

import { CreateRoomDto } from './dtos/create-room.dto';
import { UpdateRoomDto } from './dtos/update-room.dto';
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

  @Get('search')
  @HttpCode(200)
  @ApiOperation({ summary: '검색한 회의실 조회' })
  @ApiQuery({
    name: 'floorId',
    required: false,
    type: Number,
  })
  @ApiResponse({ status: 200, description: 'Success' })
  async searchAll(@Query() search): Promise<Room[]> {
    const rooms = await this.roomService.searchAll(search);

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
  async createOne(@Body() createRoomDto: CreateRoomDto): Promise<Room> {
    const room = await this.roomService.createOne(createRoomDto);

    return room;
  }

  @Patch(':roomId')
  @HttpCode(200)
  @ApiOperation({ summary: '특정 회의실 수정' })
  @ApiResponse({ status: 200, description: 'Success' })
  async updateOne(
    @Param('roomId') roomId: number,
    @Body() updateRoomDto: UpdateRoomDto,
  ): Promise<string> {
    await this.roomService.updateOne(roomId, updateRoomDto);

    return 'success';
  }

  @Delete(':roomId')
  @HttpCode(200)
  @ApiOperation({ summary: '특정 회의실 삭제' })
  @ApiResponse({ status: 200, description: 'Success' })
  async deleteOne(@Param('roomId') roomId: number): Promise<Room> {
    const room = await this.roomService.deleteOne(roomId);

    return room;
  }
}
