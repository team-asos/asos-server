import HttpError from 'src/common/exceptions/http.exception';
import { ErrorMessage } from 'src/common/utils/errors/ErrorMessage';
import { QuestionRepository } from 'src/question/question.repository';
import { UserRepository } from 'src/user/user.repository';

import { HttpStatus, Injectable } from '@nestjs/common';

import { Answer } from './answer.entity';
import { AnswerRepository } from './answer.repository';
import { CreateAnswerDto } from './dtos/create-answer.dto';
import { SearchAnswerDto } from './dtos/search-answer.dto';
import { UpdateAnswerDto } from './dtos/update-answer.dto';

@Injectable()
export class AnswerService {
  constructor(
    private readonly answerRepository: AnswerRepository,
    private readonly questionRepository: QuestionRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async findAll(): Promise<Answer[]> {
    const answers = await this.answerRepository.find();

    return answers;
  }

  async searchAll(search: SearchAnswerDto): Promise<Answer[]> {
    const answers = await this.answerRepository.search(search);

    return answers;
  }

  async createOne(createAnswerDto: CreateAnswerDto): Promise<void> {
    const { userId, questionId } = createAnswerDto;

    const user = await this.userRepository.findOne(userId);

    if (user === undefined)
      throw new HttpError(HttpStatus.NOT_FOUND, ErrorMessage.NOT_FOUND_USER);

    const question = await this.questionRepository.findOne(questionId);

    if (question === undefined)
      throw new HttpError(
        HttpStatus.NOT_FOUND,
        ErrorMessage.NOT_FOUND_QUESTION,
      );

    let answer = new Answer();
    answer = {
      ...answer,
      ...createAnswerDto,
      user,
      question,
    };

    await this.answerRepository.save(answer);

    return;
  }

  async updateOne(
    answerId: number,
    updateAnswerDto: UpdateAnswerDto,
  ): Promise<void> {
    let answer = await this.answerRepository.findOne(answerId);

    if (answer === undefined)
      throw new HttpError(HttpStatus.NOT_FOUND, ErrorMessage.NOT_FOUND_ANSWER);

    answer = { ...answer, ...updateAnswerDto };

    await this.answerRepository.save(answer);
  }

  async deleteOne(answerId: number): Promise<void> {
    const answer = await this.answerRepository.findOne(answerId);

    if (answer === undefined)
      throw new HttpError(HttpStatus.NOT_FOUND, ErrorMessage.NOT_FOUND_ANSWER);

    await this.answerRepository.deleteOneById(answerId);
  }
}
