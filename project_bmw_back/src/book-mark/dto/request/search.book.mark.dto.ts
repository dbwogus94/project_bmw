import { Dto } from '@user/dto/dto.interface';
import { IsNumber } from 'class-validator';

export class SearchBookMarkDto implements Dto {
  @IsNumber()
  public routeId!: number; // 노선Id

  @IsNumber()
  public stationSeq!: number; // 노선 경유 정류소 순번
}
