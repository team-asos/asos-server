import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FloorController } from './floor.controller';
import { FloorRepository } from './floor.repository';
import { FloorService } from './floor.service';

@Module({
  imports: [TypeOrmModule.forFeature([FloorRepository])],
  controllers: [FloorController],
  providers: [FloorService],
  exports: [FloorService],
})
export class FloorModule {}
