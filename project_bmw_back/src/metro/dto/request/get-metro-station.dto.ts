import { Dto } from '@user/dto/dto.interface';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class GetMetroStation implements Dto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  public metroId!: number;
}
