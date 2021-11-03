import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AnswerModule } from './answer/answer.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { FacilityModule } from './facility/facility.module';
import { FloorModule } from './floor/floor.module';
import { QuestionModule } from './question/question.module';
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
    QuestionModule,
    AnswerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
