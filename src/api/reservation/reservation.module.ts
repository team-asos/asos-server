import { RoomRepository } from 'src/api/room/room.repository';
import { SeatRepository } from 'src/api/seat/seat.repository';
import { UserRepository } from 'src/api/user/user.repository';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReservationController } from './reservation.controller';
import { ReservationRepository } from './reservation.repository';
import { ReservationService } from './reservation.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserRepository,
      ReservationRepository,
      SeatRepository,
      RoomRepository,
    ]),
  ],
  controllers: [ReservationController],
  providers: [ReservationService],
})
export class ReservationModule {}
