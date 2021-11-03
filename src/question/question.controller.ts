import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateQuestionDto } from './dtos/create-question.dto';

import { QuestionService } from './question.service';

@ApiTags('questions')
@Controller('questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: '질문 생성' })
  @ApiResponse({ status: 201, description: 'Success' })
  async createOne(
    @Body() createQuestionDto: CreateQuestionDto,
  ): Promise<string> {
    await this.questionService.createOne(createQuestionDto);

    return 'success';
  }
}
