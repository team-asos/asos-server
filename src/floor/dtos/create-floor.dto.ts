import { IsString } from 'class-validator';
export class CreateFloorDto {
  @IsString()
  name: string;
}
