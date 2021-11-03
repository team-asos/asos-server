import { Injectable } from '@nestjs/common';
import { AnswerRepository } from './answer.repository';

@Injectable()
export class AnswerService {
  constructor(private readonly answerRepository: AnswerRepository) {}
}
