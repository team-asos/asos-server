import { UserModule } from 'src/api/user/user.module';
import { MockService } from 'src/mock/mock.service';

import { Module } from '@nestjs/common';

@Module({
  imports: [UserModule],
  providers: [MockService],
  exports: [MockService],
})
export class MockModule {}
