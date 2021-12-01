import { FloorRepository } from 'src/api/floor/floor.repository';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FacilityController } from './facility.controller';
import { FacilityRepository } from './facility.repository';
import { FacilityService } from './facility.service';

@Module({
  imports: [TypeOrmModule.forFeature([FacilityRepository, FloorRepository])],
  controllers: [FacilityController],
  providers: [FacilityService],
})
export class FacilityModule {}
