import { FloorRepository } from 'src/api/floor/floor.repository';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RoomController } from './room.controller';
import { RoomRepository } from './room.repository';
import { RoomService } from './room.service';

@Module({
  imports: [TypeOrmModule.forFeature([RoomRepository, FloorRepository])],
  controllers: [RoomController],
  providers: [RoomService],
  exports: [RoomService],
})
export class RoomModule {}
