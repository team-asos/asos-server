import { createObjectCsvWriter } from 'csv-writer';
import * as moment from 'moment';
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

  @Cron(CronExpression.EVERY_SECOND)
  async test(): Promise<void> {
    const path = './file/';
    const fileName = `import_${moment().format('YYYYMMDDHHMMss')}`;
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

    const records = [
      {
        location: '7F-17',
        start_time: '09 : 30',
        end_time: '10 : 30',
        department: '개발1팀',
        phone: '010-0000-0000',
        name: '홍길동',
        status: '회의중',
      },
    ];

    await csvWriter.writeRecords(records);

    return;
  }
}
