import { PartialType, PickType } from '@nestjs/swagger';

import { CreateQuestionDto } from './create-question.dto';

export class SearchQuestionDto extends PartialType(
  PickType(CreateQuestionDto, ['userId'] as const),
) {}
