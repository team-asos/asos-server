import HttpError from 'src/common/exceptions/http.exception';
import { HttpMessage } from 'src/common/utils/errors/http-message.enum';
import { UserRepository } from 'src/user/user.repository';

import { HttpStatus, Injectable } from '@nestjs/common';

import { CreateQuestionDto } from './dtos/create-question.dto';
import { SearchQuestionDto } from './dtos/search-question.dto';
import { UpdateQuestionDto } from './dtos/update-question.dto';
import { Question } from './question.entity';
import { QuestionRepository } from './question.repository';

@Injectable()
export class QuestionService {
  constructor(
    private readonly questionRepository: QuestionRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async findAll(): Promise<Question[]> {
    const questions = await this.questionRepository.find();

    return questions;
  }

  async searchAll(search: SearchQuestionDto): Promise<Question[]> {
    const questions = await this.questionRepository.search(search);

    return questions;
  }

  async createOne(createQuestionDto: CreateQuestionDto): Promise<void> {
    const { userId } = createQuestionDto;

    const user = await this.userRepository.findOne(userId);

    if (user === undefined)
      throw new HttpError(HttpStatus.NOT_FOUND, HttpMessage.NOT_FOUND_USER);

    let question = new Question();
    question = {
      ...question,
      ...createQuestionDto,
      user,
    };

    await this.questionRepository.save(question);

    return;
  }

  async updateOne(
    questionId: number,
    updateQuestionDto: UpdateQuestionDto,
  ): Promise<void> {
    let question = await this.questionRepository.findOne(questionId);

    if (question === undefined)
      throw new HttpError(HttpStatus.NOT_FOUND, HttpMessage.NOT_FOUND_QUESTION);

    question = { ...question, ...updateQuestionDto };

    await this.questionRepository.save(question);

    return;
  }

  async deleteOne(questionId: number): Promise<void> {
    const question = await this.questionRepository.findOne(questionId);

    if (question === undefined)
      throw new HttpError(HttpStatus.NOT_FOUND, HttpMessage.NOT_FOUND_QUESTION);

    await this.questionRepository.deleteOneById(questionId);

    return;
  }
}
