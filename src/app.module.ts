import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import CatchException from './common/filters/http-exception.filter';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { FacilityModule } from './facility/facility.module';
import { FloorModule } from './floor/floor.module';
import { ReservationModule } from './reservation/reservation.module';
import { RoomModule } from './room/room.module';
import { SeatModule } from './seat/seat.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => configService.typeOrmConfig,
    }),
    AuthModule,
    UserModule,
    ReservationModule,
    SeatModule,
    RoomModule,
    FloorModule,
    FacilityModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
