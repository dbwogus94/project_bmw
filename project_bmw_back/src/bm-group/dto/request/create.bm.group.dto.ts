import { Dto } from '@user/dto/dto.interface';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBmGroupDto implements Dto {
  @IsNotEmpty()
  @IsString()
  public bmGroupName!: string;
}
