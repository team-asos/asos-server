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

import { CreateFacilityDto } from './dtos/create-facility.dto';
import { UpdateFacilityDto } from './dtos/update-facility.dto';
import { Facility } from './facility.entity';
import { FacilityService } from './facility.service';

@ApiTags('facilities')
@Controller('facilities')
export class FacilityController {
  constructor(private readonly facilityService: FacilityService) {}

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: '모든 시설 조회' })
  @ApiResponse({ status: 200, description: 'Success' })
  async findAll(): Promise<Facility[]> {
    const facilities = await this.facilityService.findAll();

    return facilities;
  }

  @Get('search')
  @HttpCode(200)
  @ApiOperation({ summary: '검색한 시설 조회' })
  @ApiQuery({
    name: 'floorId',
    required: false,
    type: Number,
  })
  @ApiResponse({ status: 200, description: 'Success' })
  async searchAll(@Query() search): Promise<Facility[]> {
    const facilities = await this.facilityService.searchAll(search);

    return facilities;
  }

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: '시설 생성' })
  @ApiResponse({ status: 201, description: 'Success' })
  @ApiResponse({ status: 400, description: 'Fail to Save Facility' })
  @ApiResponse({ status: 404, description: 'Wrong floorId' })
  async createOne(
    @Body() createFacilityDto: CreateFacilityDto,
  ): Promise<string> {
    await this.facilityService.createOne(createFacilityDto);

    return 'success';
  }

  @Patch(':facilityId')
  @HttpCode(200)
  @ApiOperation({ summary: '특정 시설 수정' })
  @ApiResponse({ status: 200, description: 'Success' })
  async updateOne(
    @Param('facilityId') facilityId: number,
    @Body() updatefacilityDto: UpdateFacilityDto,
  ): Promise<string> {
    await this.facilityService.updateOne(facilityId, updatefacilityDto);

    return 'success';
  }

  @Delete(':facilityId')
  @HttpCode(200)
  @ApiOperation({ summary: '특정 시설 삭제' })
  @ApiResponse({ status: 200, description: 'Success' })
  async deleteOne(@Param('facilityId') facilityId: number): Promise<string> {
    await this.facilityService.deleteOne(facilityId);

    return 'success';
  }
}
