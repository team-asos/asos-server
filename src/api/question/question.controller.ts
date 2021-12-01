import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateQuestionDto } from './dtos/create-question.dto';
import { UpdateQuestionDto } from './dtos/update-question.dto';
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

  @Patch(':questionId')
  @HttpCode(200)
  @ApiOperation({ summary: '특정 질문 수정' })
  @ApiResponse({ status: 200, description: 'Success' })
  async updateOne(
    @Param('questionId') questionId: number,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ): Promise<string> {
    await this.questionService.updateOne(questionId, updateQuestionDto);

    return 'success';
  }

  @Delete(':questionId')
  @HttpCode(200)
  @ApiOperation({ summary: '특정 질문 삭제' })
  @ApiResponse({ status: 200, description: 'Success' })
  async deleteOne(@Param('questionId') questionId: number): Promise<string> {
    await this.questionService.deleteOne(questionId);

    return 'success';
  }
}
