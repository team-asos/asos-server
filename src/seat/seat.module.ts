import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationRepository } from 'src/reservation/reservation.repository';

import { SeatController } from './seat.controller';
import { SeatRepository } from './seat.repository';
import { SeatService } from './seat.service';

@Module({
  imports: [TypeOrmModule.forFeature([SeatRepository, ReservationRepository])],
  controllers: [SeatController],
  providers: [SeatService],
})
export class SeatModule {}
