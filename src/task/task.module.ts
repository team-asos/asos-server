import { ReservationRepository } from 'src/reservation/reservation.repository';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TaskService } from './task.service';

@Module({
  imports: [TypeOrmModule.forFeature([ReservationRepository])],
  providers: [TaskService],
})
export class TaskModule {}
