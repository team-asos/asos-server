import { AnswerRepository } from 'src/api/answer/answer.repository';
import { UserRepository } from 'src/api/user/user.repository';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QuestionController } from './question.controller';
import { QuestionRepository } from './question.repository';
import { QuestionService } from './question.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      QuestionRepository,
      AnswerRepository,
      UserRepository,
    ]),
  ],
  controllers: [QuestionController],
  providers: [QuestionService],
})
export class QuestionModule {}
