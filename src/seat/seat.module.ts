import { FloorRepository } from 'src/floor/floor.repository';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SeatController } from './seat.controller';
import { SeatRepository } from './seat.repository';
import { SeatService } from './seat.service';

@Module({
  imports: [TypeOrmModule.forFeature([SeatRepository, FloorRepository])],
  controllers: [SeatController],
  providers: [SeatService],
})
export class SeatModule {}
