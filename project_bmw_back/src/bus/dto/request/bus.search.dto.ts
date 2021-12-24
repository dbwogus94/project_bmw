import { Dto } from '@user/dto/dto.interface';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class BusSearchDto implements Dto {
  @IsNotEmpty()
  @IsString()
  @Transform(params => params.value.trim()) // 위생화
  public routeName!: string;
}
