import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FloorRepository } from './floor.repository';

@Module({
  imports: [TypeOrmModule.forFeature([FloorRepository])],
})
export class FloorModule {}
