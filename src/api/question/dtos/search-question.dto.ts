import { IsNumber } from 'class-validator';

export class SearchQuestionDto {
  @IsNumber()
  userId?: number;
}
