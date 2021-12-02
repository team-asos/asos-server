import { UserModule } from 'src/api/user/user.module';
import { MockService } from 'src/mock/mock.service';

import { Module } from '@nestjs/common';
import { FloorModule } from 'src/api/floor/floor.module';
import { SeatModule } from 'src/api/seat/seat.module';

@Module({
  imports: [UserModule, FloorModule, SeatModule],
  providers: [MockService],
  exports: [MockService],
})
export class MockModule {}
