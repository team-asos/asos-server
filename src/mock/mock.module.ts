import { FloorModule } from 'src/api/floor/floor.module';
import { RoomModule } from 'src/api/room/room.module';
import { SeatModule } from 'src/api/seat/seat.module';
import { UserModule } from 'src/api/user/user.module';
import { MockService } from 'src/mock/mock.service';

import { Module } from '@nestjs/common';

@Module({
  imports: [UserModule, FloorModule, SeatModule, RoomModule],
  providers: [MockService],
  exports: [MockService],
})
export class MockModule {}
