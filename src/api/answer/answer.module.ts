import { QuestionRepository } from 'src/api/question/question.repository';
import { UserRepository } from 'src/api/user/user.repository';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AnswerController } from './answer.controller';
import { AnswerRepository } from './answer.repository';
import { AnswerService } from './answer.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AnswerRepository,
      QuestionRepository,
      UserRepository,
    ]),
  ],
  controllers: [AnswerController],
  providers: [AnswerService],
  exports: [AnswerService],
})
export class AnswerModule {}
