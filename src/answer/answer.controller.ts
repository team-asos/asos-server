import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AnswerService } from './answer.service';
import { CreateAnswerDto } from './dtos/create-answer.dto';

@ApiTags('answers')
@Controller('answers')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: '답변 생성' })
  @ApiResponse({ status: 201, description: 'Success' })
  async createOne(@Body() createAnswerDto: CreateAnswerDto): Promise<string> {
    await this.answerService.createOne(createAnswerDto);

    return 'success';
  }
}
