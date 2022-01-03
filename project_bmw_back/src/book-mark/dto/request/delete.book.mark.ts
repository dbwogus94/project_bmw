import { Dto } from '@user/dto/dto.interface';
import { IsNumber } from 'class-validator';

export class DeleteBookMarkDto implements Dto {
  @IsNumber()
  public bookMarkId!: number; // pk
}
