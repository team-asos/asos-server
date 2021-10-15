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

import { CreateFacilityDto } from './facility.dto';
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

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: '시설 생성' })
  @ApiResponse({ status: 201, description: 'Success' })
  @ApiResponse({ status: 404, description: 'Wrong facilityId' })
  async createOne(
    @Body() createFacilityDto: CreateFacilityDto,
  ): Promise<string> {
    await this.facilityService.createOne(createFacilityDto);
    return 'success';
  }

  @Delete(':facilityId')
  @HttpCode(200)
  @ApiOperation({ summary: '시설 삭제' })
  @ApiResponse({ status: 200, description: 'Success' })
  async deleteOne(@Param('facilityId') facilityId: number): Promise<string> {
    await this.facilityService.deleteOne(facilityId);

    return 'success';
  }
}
