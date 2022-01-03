import { Dto } from '@user/dto/dto.interface';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class GetBmGroupDto implements Dto {
  @IsNotEmpty()
  @IsNumber()
  public bmGroupId!: number;
}
