import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AnswerService } from './answer.service';

@ApiTags('answers')
@Controller('answers')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}
}
