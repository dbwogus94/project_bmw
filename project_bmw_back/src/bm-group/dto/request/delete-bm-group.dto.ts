import { Dto } from '@user/dto/dto.interface';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class deleteBmGroupDto implements Dto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  public bmGroupId!: number;
}
