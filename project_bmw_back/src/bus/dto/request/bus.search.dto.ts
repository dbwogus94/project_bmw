import { Dto } from '@user/dto/dto.interface';
import { IsNotEmpty, IsString } from 'class-validator';

export class BusSearchDto implements Dto {
  @IsNotEmpty()
  @IsString()
  public routeName!: string;
}
