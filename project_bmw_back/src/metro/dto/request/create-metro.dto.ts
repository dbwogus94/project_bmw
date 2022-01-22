import { Dto } from '@user/dto/dto.interface';
import { IsNotEmpty } from 'class-validator';

export class CreateMetroDto implements Dto {
  @IsNotEmpty()
  metroName!: string;

  @IsNotEmpty()
  metroCd!: string;

  @IsNotEmpty()
  districtCd!: 1 | 2 | 3;
}
