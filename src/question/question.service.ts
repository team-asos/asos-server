import { Injectable } from '@nestjs/common';
import { QuestionRepository } from './question.repository';

@Injectable()
export class QuestionService {
  constructor(private readonly questionRepository: QuestionRepository) {}
}
