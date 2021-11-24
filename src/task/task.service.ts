import { createObjectCsvWriter } from 'csv-writer';
import * as fs from 'fs';
import * as moment from 'moment';
import { FtpService } from 'nestjs-ftp';
import { ReservationRepository } from 'src/reservation/reservation.repository';

import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TaskService {
  constructor(
    private readonly reservationRepository: ReservationRepository,
    private readonly ftpService: FtpService,
  ) {}

  @Cron(CronExpression.EVERY_5_SECONDS)
  async updateReservationStatus(): Promise<void> {
    await this.reservationRepository.updateStatus();

    await this.eslConverter();

    return;
  }

  private async eslConverter(): Promise<void> {
    const reservations = await this.reservationRepository.parseReservation();

    const parse = reservation => {
      return {
        floor: reservation.seat
          ? `${reservation.seat.floor.name}`
          : `${reservation.room.floor.name}`,
        location: reservation.seat
          ? `${reservation.seat.name}`
          : `${reservation.room.name}`,
        start_time: moment(reservation.startTime).format('HH : mm'),
        end_time: moment(reservation.endTime).format('HH : mm'),
        department: reservation.user.department,
        phone: reservation.user.tel,
        name: reservation.user.name,
        status: reservation.status,
        tag_id: reservation.seat
          ? reservation.seat.tagId
          : reservation.room.tagId,
      };
    };

    const records = reservations.map(reservation => parse(reservation));

    const originPath = './file/';
    const destinationPath = 'Import/';
    const file = `import_${moment().format('YYYYMMDDHHmmss')}.csv`;

    const csvWriter = createObjectCsvWriter({
      path: originPath + file,
      header: [
        { id: 'floor', title: 'floor' },
        { id: 'location', title: 'location' },
        { id: 'start_time', title: 'start_time' },
        { id: 'end_time', title: 'end_time' },
        { id: 'department', title: 'department' },
        { id: 'phone', title: 'phone' },
        { id: 'name', title: 'name' },
        { id: 'status', title: 'status' },
        { id: 'tag_id', title: 'tag_id' },
      ],
    });

    await csvWriter.writeRecords(records);

    fs.unlinkSync(`${originPath}${file}`);

    // try {
    //   const response = await this.ftpService.upload(
    //     `${originPath}${file}`,
    //     `${destinationPath}${file}`,
    //   );

    //   if (response.code === 226) console.log('FTP 전송 성공!');
    //   else if (response.code === 0) console.log('FTP 전송 실패!');
    //   else console.log('알 수 없는 응답');
    // } catch (error) {
    //   console.log(error);
    // } finally {
    //   fs.unlinkSync(`${originPath}${file}`);
    // }

    return;
  }
}
