import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Answer } from './answer.entity';
import { AnswerService } from './answer.service';
import { CreateAnswerDto } from './dtos/create-answer.dto';

@ApiTags('answers')
@Controller('answers')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: '모든 답변 조회' })
  @ApiResponse({ status: 200, description: 'Success' })
  async findAll(): Promise<Answer[]> {
    const answers = await this.answerService.findAll();

    return answers;
  }

  @Get('search')
  @HttpCode(200)
  @ApiOperation({ summary: '검색한 답변 조회' })
  @ApiQuery({
    name: 'userId',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'questionId',
    required: false,
    type: Number,
  })
  @ApiResponse({ status: 200, description: 'Success' })
  async searchAll(@Query() search): Promise<Answer[]> {
    const answers = await this.answerService.searchAll(search);

    return answers;
  }

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: '답변 생성' })
  @ApiResponse({ status: 201, description: 'Success' })
  async createOne(@Body() createAnswerDto: CreateAnswerDto): Promise<string> {
    await this.answerService.createOne(createAnswerDto);

    return 'success';
  }
}
