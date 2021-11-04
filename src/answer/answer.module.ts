import { QuestionRepository } from 'src/question/question.repository';
import { UserRepository } from 'src/user/user.repository';

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
})
export class AnswerModule {}
