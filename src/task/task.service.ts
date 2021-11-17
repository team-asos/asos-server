import { createObjectCsvWriter } from 'csv-writer';
import * as moment from 'moment';
import { ReservationRepository } from 'src/reservation/reservation.repository';

import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TaskService {
  constructor(private readonly reservationRepository: ReservationRepository) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async updateReservationStatus(): Promise<void> {
    await this.reservationRepository.updateReservationStatus();

    await this.parseReservation();

    return;
  }

  private async parseReservation(): Promise<void> {
    const reservations = await this.reservationRepository.parseReservation();

    const parse = reservation => {
      return {
        location: reservation.seat
          ? `${reservation.seat.floor.name}-${reservation.seat.name}`
          : `${reservation.room.floor.name}-${reservation.room.name}`,
        start_time: moment(reservation.startTime).format('HH : MM'),
        end_time: moment(reservation.endTime).format('HH : MM'),
        department: reservation.user.department,
        phone: reservation.user.tel,
        name: reservation.user.name,
        status: reservation.status,
      };
    };

    const records = reservations.map(reservation => parse(reservation));

    const path = './file/';
    const fileName = `import_${moment().format('YYYYMMDDHHmmss')}`;
    const extension = '.csv';

    const csvWriter = createObjectCsvWriter({
      path: path + fileName + extension,
      header: [
        { id: 'location', title: 'location' },
        { id: 'start_time', title: 'start_time' },
        { id: 'end_time', title: 'end_time' },
        { id: 'department', title: 'department' },
        { id: 'phone', title: 'phone' },
        { id: 'name', title: 'name' },
        { id: 'status', title: 'status' },
      ],
    });

    await csvWriter.writeRecords(records);

    return;
  }
}
