import { AnswerRepository } from 'src/api/answer/answer.repository';
import { UserRepository } from 'src/api/user/user.repository';
import HttpError from 'src/common/exceptions/http.exception';
import { HttpMessage } from 'src/common/utils/errors/http-message.enum';

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
    private readonly answerRepository: AnswerRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async findAll(): Promise<Question[]> {
    const questions = await this.questionRepository.getMany();

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

    try {
      await this.questionRepository.save(question);
    } catch (err) {
      throw new HttpError(
        HttpStatus.BAD_REQUEST,
        HttpMessage.FAIL_SAVE_QUESTION,
      );
    }
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

    try {
      await this.questionRepository.save(question);
    } catch (err) {
      throw new HttpError(
        HttpStatus.BAD_REQUEST,
        HttpMessage.FAIL_UPDATE_QUESTION,
      );
    }

    return;
  }

  async deleteOne(questionId: number): Promise<void> {
    const question = await this.questionRepository.getOneById(questionId);

    if (question === undefined)
      throw new HttpError(HttpStatus.NOT_FOUND, HttpMessage.NOT_FOUND_QUESTION);

    try {
      await this.questionRepository.deleteOneById(questionId);
    } catch (err) {
      throw new HttpError(
        HttpStatus.BAD_REQUEST,
        HttpMessage.FAIL_DELETE_QUESTION,
      );
    } finally {
      if (question.answer)
        await this.answerRepository.deleteOneById(question.answer.id);
    }

    return;
  }
}
