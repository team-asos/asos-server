import { FtpModule } from 'nestjs-ftp';
import { ReservationRepository } from 'src/api/reservation/reservation.repository';
import { RoomRepository } from 'src/api/room/room.repository';
import { SeatRepository } from 'src/api/seat/seat.repository';
import { ConfigService } from 'src/config/config.service';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TaskService } from './task.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SeatRepository,
      RoomRepository,
      ReservationRepository,
    ]),
    FtpModule.forRootFtpAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          host: configService.get('FTP_HOST'),
          port: configService.getNumber('FTP_PORT'),
          user: configService.get('FTP_USER'),
          password: configService.get('FTP_PASSWORD'),
          secure: configService.getBoolean('FTP_SECURE'),
        };
      },
    }),
  ],
  providers: [TaskService],
})
export class TaskModule {}
