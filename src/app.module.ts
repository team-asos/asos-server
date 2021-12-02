import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AnswerModule } from './api/answer/answer.module';
import { FacilityModule } from './api/facility/facility.module';
import { FloorModule } from './api/floor/floor.module';
import { QuestionModule } from './api/question/question.module';
import { ReservationModule } from './api/reservation/reservation.module';
import { RoomModule } from './api/room/room.module';
import { SeatModule } from './api/seat/seat.module';
import { UserModule } from './api/user/user.module';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { MockModule } from './mock/mock.module';
import { TaskModule } from './tasks/task.module';

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
    ScheduleModule.forRoot(),
    TaskModule,
    MockModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
