import { IsNumber, IsString, Length, MinLength } from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  @MinLength(1)
  title: string;

  @IsString()
  @Length(0, 500)
  message: string;

  @IsNumber()
  userId: number;
}
