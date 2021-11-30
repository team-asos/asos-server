import { IsNumber, IsString, Length } from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  title: string;

  @IsString()
  @Length(0, 500)
  message: string;

  @IsNumber()
  userId: number;
}
