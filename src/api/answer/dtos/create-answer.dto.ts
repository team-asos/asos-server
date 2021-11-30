import { IsNumber, IsString, Length } from 'class-validator';

export class CreateAnswerDto {
  @IsString()
  @Length(0, 500)
  message: string;

  @IsNumber()
  userId: number;

  @IsNumber()
  questionId: number;
}
