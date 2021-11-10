import { ReservationRepository } from 'src/reservation/reservation.repository';

import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TaskService {
  constructor(private readonly reservationRepository: ReservationRepository) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleReservation(): Promise<void> {
    await this.reservationRepository.handleReservationStatus();

    return;
  }
}
