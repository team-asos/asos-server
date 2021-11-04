import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FloorRepository } from './floor.repository';
import { FloorController } from './floor.controller';
import { FloorService } from './floor.service';

@Module({
  imports: [TypeOrmModule.forFeature([FloorRepository])],
  controllers: [FloorController],
  providers: [FloorService],
})
export class FloorModule {}
