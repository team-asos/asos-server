import { EntityRepository, Repository } from 'typeorm';

import { SearchQuestionDto } from './dtos/search-question.dto';
import { Question } from './question.entity';

@EntityRepository(Question)
export class QuestionRepository extends Repository<Question> {
  async search(search: SearchQuestionDto): Promise<Question[]> {
    const { userId } = search;

    const questions = await this.createQueryBuilder('question')
      .leftJoinAndSelect('question.answer', 'answer')
      .where(userId ? 'question.user_id = (:userId)' : '1=1', { userId })
      .getMany();

    return questions;
  }

  async deleteOneById(questionId: number) {
    await this.createQueryBuilder('question')
      .softDelete()
      .where('id = (:questionId)', { questionId })
      .execute();
  }
}
