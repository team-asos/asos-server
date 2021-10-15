import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FacilityService } from './facility.service';
import { FacilityRepository } from './facility.repository';
import { FacilityController } from './facility.controller';
import { FloorRepository } from 'src/floor/floor.repository';
@Module({
  imports: [TypeOrmModule.forFeature([FacilityRepository, FloorRepository])],
  controllers: [FacilityController],
  providers: [FacilityService],
})
export class FacilityModule {}
