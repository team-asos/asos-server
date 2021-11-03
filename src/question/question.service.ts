import HttpError from 'src/common/exceptions/http.exception';
import { ErrorMessage } from 'src/common/utils/errors/ErrorMessage';
import { UserRepository } from 'src/user/user.repository';

import { HttpStatus, Injectable } from '@nestjs/common';

import { CreateQuestionDto } from './dtos/create-question.dto';
import { Question } from './question.entity';
import { QuestionRepository } from './question.repository';

@Injectable()
export class QuestionService {
  constructor(
    private readonly questionRepository: QuestionRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async createOne(createQuestionDto: CreateQuestionDto): Promise<void> {
    const { userId } = createQuestionDto;

    const user = await this.userRepository.findOne(userId);

    if (user === undefined)
      throw new HttpError(HttpStatus.NOT_FOUND, ErrorMessage.NOT_FOUND_USER);

    let question = new Question();
    question = {
      ...question,
      ...createQuestionDto,
      user,
    };

    await this.questionRepository.save(question);

    return;
  }
}
