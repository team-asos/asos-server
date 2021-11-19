import { ReservationRepository } from 'src/reservation/reservation.repository';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TaskService } from './task.service';
import { FtpModule } from 'nestjs-ftp';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReservationRepository]),
    FtpModule.forRootFtpAsync({
      useFactory: async () => {
        return {
          host: '192.168.0.200',
          port: 2121,
          user: 'cgESLUser',
          password: 'cgESLPassword',
          secure: false,
        };
      },
    }),
  ],
  providers: [TaskService],
})
export class TaskModule {}
