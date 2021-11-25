import { createObjectCsvWriter } from 'csv-writer';
import { unlinkSync } from 'fs';
import * as moment from 'moment';
import { FtpService } from 'nestjs-ftp';
import { LoggerService } from 'src/common/utils/logger/logger.service';
import { ConfigService } from 'src/config/config.service';
import { ReservationRepository } from 'src/reservation/reservation.repository';

import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TaskService {
  constructor(
    private readonly reservationRepository: ReservationRepository,
    private readonly ftpService: FtpService,
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService,
  ) {}

  @Cron('0 */3 * * * *')
  async eslConverter(): Promise<void> {
    await this.reservationRepository.updateStatus();

    if (this.configService.getBoolean('FTP_ALLOW'))
      await this.sendReservations();

    return;
  }

  async sendReservations(): Promise<void> {
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

    try {
      const response = await this.ftpService.upload(
        `${originPath}${file}`,
        `${destinationPath}${file}`,
      );

      if (response.code === 226) this.loggerService.info('ftp success');
      else if (response.code === 0) this.loggerService.error('ftp failed');
      else this.loggerService.error('ftp unknown response');
    } catch (error) {
      console.log(error);
    } finally {
      unlinkSync(`${originPath}${file}`);
    }

    return;
  }
}
