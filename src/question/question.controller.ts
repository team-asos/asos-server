import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { QuestionService } from './question.service';

@ApiTags('questions')
@Controller('questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}
}
