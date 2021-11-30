import { PartialType, PickType } from '@nestjs/swagger';

import { CreateAnswerDto } from './create-answer.dto';

export class SearchAnswerDto extends PartialType(
  PickType(CreateAnswerDto, ['userId', 'questionId'] as const),
) {}
