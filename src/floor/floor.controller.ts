import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Patch,
  Delete,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateFloorDto } from './dtos/create-floor.dto';
import { UpdateFloorDto } from './dtos/update-floor.dto';
import { Floor } from './floor.entity';
import { FloorService } from './floor.service';

@ApiTags('floors')
@Controller('floors')
export class FloorController {
  constructor(private readonly floorService: FloorService) {}

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: '모든 층 조회' })
  @ApiResponse({ status: 200, description: 'Success' })
  async findAll(): Promise<Floor[]> {
    const floors = await this.floorService.findAll();

    return floors;
  }

  @Get(':floorId')
  @HttpCode(200)
  @ApiOperation({ summary: '특정 층 조회' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 404, description: 'Wrong floorId' })
  async findOne(@Param('floorId') floorId: number): Promise<Floor> {
    const floor = await this.floorService.findOne(floorId);

    return floor;
  }

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: '층 생성' })
  @ApiResponse({ status: 201, description: 'Success' })
  @ApiResponse({ status: 400, description: 'Fail to Save floorId' })
  async createOne(@Body() createFloorDto: CreateFloorDto): Promise<string> {
    await this.floorService.createOne(createFloorDto);

    return 'success';
  }

  @Delete('floorId')
  @HttpCode(201)
  @ApiOperation({ summary: '특정 층 삭제' })
  @ApiResponse({ status: 201, description: 'Success' })
  @ApiResponse({ status: 400, description: 'Fail to Delete floorId' })
  async deleteOne(@Param('floorId') floorId: number): Promise<string> {
    await this.floorService.deleteOne(floorId);

    return 'success';
  }

  @Patch(':floorId')
  @HttpCode(200)
  @ApiOperation({ summary: '특정 회의실 수정' })
  @ApiResponse({ status: 200, description: 'Success' })
  async updateOne(
    @Param('floorId') floorId: number,
    @Body() updatefloorDto: UpdateFloorDto,
  ): Promise<string> {
    await this.floorService.updateOne(floorId, updatefloorDto);

    return 'success';
  }
}
