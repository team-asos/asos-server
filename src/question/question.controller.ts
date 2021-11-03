import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateQuestionDto } from './dtos/create-question.dto';
import { Question } from './question.entity';
import { QuestionService } from './question.service';

@ApiTags('questions')
@Controller('questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: '모든 질문 조회' })
  @ApiResponse({ status: 200, description: 'Success' })
  async findAll(): Promise<Question[]> {
    const questions = await this.questionService.findAll();

    return questions;
  }

  @Get('search')
  @HttpCode(200)
  @ApiOperation({ summary: '검색한 질문 조회' })
  @ApiQuery({
    name: 'userId',
    required: false,
    type: Number,
  })
  @ApiResponse({ status: 200, description: 'Success' })
  async searchAll(@Query() search): Promise<Question[]> {
    console.log(search);

    const questions = await this.questionService.searchAll(search);

    return questions;
  }

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
