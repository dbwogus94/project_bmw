import { Dto } from '@user/dto/dto.interface';
import { Transform } from 'class-transformer';

export class BookMarkDto implements Dto {
  @Transform(params => (params.value == null ? undefined : params.value))
  public bookMarkId!: number;

  @Transform(params => (params.value == null ? undefined : params.value))
  public checkColumn!: string;

  @Transform(params => (params.value == null ? undefined : params.value))
  public routeId!: number; // 노선 Id

  @Transform(params => (params.value == null ? undefined : params.value))
  public stationSeq!: number; // 경유 정류소 순번

  @Transform(params => (params.value == null ? undefined : params.value))
  public stationId!: number; // 정류소 Id

  @Transform(params => (params.value == null ? undefined : params.value))
  public label!: 'B' | 'M'; // 버스, 지하철 구분

  @Transform(params => (params.value == null ? undefined : params.value))
  public routeName!: string; // 노선 이름

  @Transform(params => (params.value == null ? undefined : params.value))
  public stationName!: string; // 정류소 이름

  @Transform(params => (params.value == null ? undefined : params.value))
  public direction!: string; // 노선 진행방향

  @Transform(params => (params.value == null ? undefined : params.value))
  public type!: 'seoul' | 'gyeonggi'; // api type

  @Transform(params => (params.value == null ? undefined : params.value))
  createdAt!: Date;

  @Transform(params => (params.value == null ? undefined : params.value))
  updatedAt!: Date;

  /* 제외 속성 */
  @Transform(params => (params.value = undefined))
  startStationName!: string;

  @Transform(params => (params.value = undefined))
  endStationName!: string;

  @Transform(params => (params.value = undefined))
  routeTypeCd!: number;

  @Transform(params => (params.value = undefined))
  routeTypeName!: string;

  @Transform(params => (params.value = undefined))
  regionName!: string;

  @Transform(params => (params.value = undefined))
  districtCd!: number;

  @Transform(params => (params.value = undefined))
  districtName!: string;

  @Transform(params => (params.value = undefined))
  minTerm!: number;

  @Transform(params => (params.value = undefined))
  maxTerm!: number;

  @Transform(params => (params.value = undefined))
  companyId!: number;

  @Transform(params => (params.value = undefined))
  companyName!: string;

  @Transform(params => (params.value = undefined))
  companyTel!: string;

  @Transform(params => (params.value = undefined))
  bmGroupId!: string;

  @Transform(params => (params.value = undefined))
  bmGroupName!: string;

  @Transform(params => (params.value = undefined))
  bmGroupBookMarkId!: string;
}
