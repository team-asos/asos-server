import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AnswerController } from './answer.controller';
import { AnswerRepository } from './answer.repository';
import { AnswerService } from './answer.service';

@Module({
  imports: [TypeOrmModule.forFeature([AnswerRepository])],
  controllers: [AnswerController],
  providers: [AnswerService],
})
export class AnswerModule {}
