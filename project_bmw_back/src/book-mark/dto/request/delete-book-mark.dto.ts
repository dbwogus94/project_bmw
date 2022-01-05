import { Dto } from '@user/dto/dto.interface';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteBookMarkDto implements Dto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  public bmGroupId!: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  public bookMarkId!: number;
}
