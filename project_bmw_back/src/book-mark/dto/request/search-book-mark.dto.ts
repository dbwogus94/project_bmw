import { Dto } from '@user/dto/dto.interface';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class SearchBookMarkDto implements Dto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  public bmGroupId!: number; // bm그룹 Id

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  public routeId!: number; // 노선Id

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  public stationSeq!: number; // 경유 정류소 순번

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  statonId!: number; // 정류소 Id
}
