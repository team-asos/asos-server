import { AnswerModule } from 'src/api/answer/answer.module';
import { FloorModule } from 'src/api/floor/floor.module';
import { QuestionModule } from 'src/api/question/question.module';
import { RoomModule } from 'src/api/room/room.module';
import { SeatModule } from 'src/api/seat/seat.module';
import { UserModule } from 'src/api/user/user.module';
import { MockService } from 'src/mock/mock.service';

import { Module } from '@nestjs/common';

@Module({
  imports: [
    UserModule,
    QuestionModule,
    AnswerModule,
    FloorModule,
    SeatModule,
    RoomModule,
  ],
  providers: [MockService],
  exports: [MockService],
})
export class MockModule {}
