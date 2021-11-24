import { RoomRepository } from 'src/room/room.repository';
import { SeatRepository } from 'src/seat/seat.repository';
import { UserRepository } from 'src/user/user.repository';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReservationController } from './reservation.controller';
import { ReservationRepository } from './reservation.repository';
import { ReservationService } from './reservation.service';
import { ParticipantRepository } from 'src/participant/participant.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserRepository,
      ReservationRepository,
      SeatRepository,
      RoomRepository,
      ParticipantRepository,
    ]),
  ],
  controllers: [ReservationController],
  providers: [ReservationService],
})
export class ReservationModule {}
