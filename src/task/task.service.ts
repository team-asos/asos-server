import { createObjectCsvWriter } from 'csv-writer';
import { unlinkSync } from 'fs';
import * as moment from 'moment';
import { FtpService } from 'nestjs-ftp';
import { LoggerService } from 'src/common/utils/logger/logger.service';
import { ConfigService } from 'src/config/config.service';
import { ReservationRepository } from 'src/reservation/reservation.repository';
import { RoomRepository } from 'src/room/room.repository';
import { SeatRepository } from 'src/seat/seat.repository';

import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TaskService {
  constructor(
    private readonly seatRepository: SeatRepository,
    private readonly roomRepository: RoomRepository,
    private readonly reservationRepository: ReservationRepository,
    private readonly ftpService: FtpService,
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService,
  ) {}

  @Cron('0 */3 * * * *')
  async eslConverter(): Promise<void> {
    await this.reservationRepository.updateStatus();

    // Development
    if (['development'].includes(this.configService.env)) {
      if (this.configService.getBoolean('FTP_ALLOW'))
        await this.sendReservations();
    }
    // Production
    else {
      if (this.configService.get('NODE_APP_INSTANCE') === '0') {
        if (this.configService.getBoolean('FTP_ALLOW'))
          await this.sendReservations();
      }
    }

    return;
  }

  async sendReservations(): Promise<void> {
    const seats = await this.seatRepository.parseSeat();
    const rooms = await this.roomRepository.parseRoom();

    const insertSpace = text =>
      text.replace(/010-/gi, '').replace(/ /gi, '').split('').join(' ');

    const seatParse = seat => {
      if (seat.reservations.length === 0) {
        return {
          tag_id: seat.tagId,
          name: ``,
          phone: ``,
          department: ``,
          location: insertSpace(seat.floor.name + '-' + seat.name),
          time: ``,
          status: ``,
          topic: ``,
          qr: `https://atec-sos.ga/seat-reservation`,
          promotion: true,
        };
      }

      const user = seat.reservations[0].user;
      const floor = seat.floor;
      const reservation = seat.reservations[0];

      // 좌석에 있는 사람이 회의중인지 확인
      const hasMeeting = rooms.map(room => {
        const reservation = room.reservations[0];

        // 빈 회의실 예외 처리
        if (!reservation) return false;

        // 회의 예약자
        if (reservation.user.id === user.id) return reservation.id;

        // 회의 참석자
        const index = reservation.participants.findIndex(
          participant => participant.user.id === user.id,
        );

        if (index !== -1) return reservation.id;

        return false;
      });

      const meetingIndex = hasMeeting.find(meeting => meeting !== false);

      return {
        tag_id: seat.tagId,
        name: insertSpace(user.name),
        phone: insertSpace(user.tel),
        department: insertSpace(user.department + '/' + user.position),
        location: insertSpace(floor.name + '-' + seat.name),
        time: moment(reservation.startTime).format('MM / DD'),
        status: meetingIndex ? '회 의 중' : '업 무 중',
        topic: ``,
        qr: meetingIndex
          ? `https://atec-sos.ga/reservation-info/${meetingIndex}`
          : ``,
        promotion: false,
      };
    };

    const roomParse = room => {
      if (room.reservations.length === 0) {
        return {
          tag_id: room.tagId,
          name: ``,
          phone: ``,
          department: ``,
          location: insertSpace(room.floor.name + '-' + room.name),
          time: ``,
          status: ``,
          topic: ``,
          qr: `https://atec-sos.ga/room-check`,
          promotion: true,
        };
      }

      const user = room.reservations[0].user;
      const reservation = room.reservations[0];

      return {
        tag_id: room.tagId,
        name: insertSpace(user.name),
        phone: user.tel.replace(/010-/gi, ''),
        department: ``,
        location: insertSpace(room.floor.name + '-' + room.name),
        time:
          moment(reservation.startTime).format('HH : mm') +
          ' - ' +
          moment(reservation.endTime).format('HH : mm'),
        status: ``,
        topic: reservation.topic,
        qr: `https://atec-sos.ga/reservation-info/${reservation.id}`,
        promotion: false,
      };
    };

    const seatRecords = seats.map(seat => seatParse(seat));
    const roomRecords = rooms.map(room => roomParse(room));
    const records = seatRecords.concat(roomRecords);

    const originPath = './file/';
    const destinationPath = 'Import/';
    const file = `import_${moment().format('YYYYMMDDHHmmss')}.csv`;

    const csvWriter = createObjectCsvWriter({
      path: originPath + file,
      header: [
        { id: 'tag_id', title: 'tag_id' },
        { id: 'name', title: 'name' },
        { id: 'phone', title: 'phone' },
        { id: 'department', title: 'department' },
        { id: 'location', title: 'location' },
        { id: 'time', title: 'time' },
        { id: 'status', title: 'status' },
        { id: 'topic', title: 'topic' },
        { id: 'qr', title: 'qr' },
        { id: 'promotion', title: 'promotion' },
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
