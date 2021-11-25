import { FtpModule } from 'nestjs-ftp';
import { ConfigService } from 'src/config/config.service';
import { ReservationRepository } from 'src/reservation/reservation.repository';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TaskService } from './task.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReservationRepository]),
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
