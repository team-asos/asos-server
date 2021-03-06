import { EntityRepository, Repository } from 'typeorm';

import { Answer } from './answer.entity';
import { SearchAnswerDto } from './dtos/search-answer.dto';

@EntityRepository(Answer)
export class AnswerRepository extends Repository<Answer> {
  async search(search: SearchAnswerDto): Promise<Answer[]> {
    const { userId, questionId } = search;

    const answers = await this.createQueryBuilder('answer')
      .leftJoin('answer.question', 'question')
      .addSelect('question.id')
      .where(userId ? 'answer.user_id = (:userId)' : '1=1', { userId })
      .andWhere(questionId ? 'answer.question_id = (:questionId)' : '1=1', {
        questionId,
      })
      .getMany();

    return answers;
  }

  async deleteOneById(answerId: number) {
    await this.createQueryBuilder('answer')
      .softDelete()
      .where('id = (:answerId)', { answerId })
      .execute();
  }
}
