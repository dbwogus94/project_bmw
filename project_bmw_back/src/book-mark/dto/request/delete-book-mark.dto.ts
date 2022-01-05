import { Dto } from '@user/dto/dto.interface';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteBookMarkDto implements Dto {
  @IsNotEmpty()
  @IsNumber()
  public bmGroupId!: number;

  @IsNotEmpty()
  @IsNumber()
  public bookMarkId!: number; // pk
}
