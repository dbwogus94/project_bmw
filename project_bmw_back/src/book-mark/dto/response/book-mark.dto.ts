import { getDistrictName } from '@shared/util';
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
  public arsId!: string; // 경기도: 고유모바일번호(mobileNo) / 서울시: 정류소 고유번호(arsId), 서울시 지하철: 외부 코드(stationFrCode)

  @Transform(params => (params.value == null ? undefined : params.value))
  public label!: 'B' | 'M'; // 버스, 지하철 구분

  @Transform(params => (params.value == null ? undefined : params.value))
  public routeName!: string; // 노선 이름

  @Transform(params => (params.value == null ? undefined : params.value))
  public stationName!: string; // 정류소 이름

  @Transform(params => (params.value == null ? undefined : params.value))
  public direction!: string; // 노선 진행방향

  @Transform(params => (params.value == null ? undefined : params.value))
  public regionName!: string; // 운행지역

  @Transform(params => (params.value == null ? undefined : params.value))
  public districtCd!: number; // 관할지역코드

  @Transform(params => {
    const { districtCd, type } = params.obj;
    return params.value == null ? undefined : getDistrictName(districtCd, type);
  })
  public districtName!: string; // 관할지역명

  @Transform(params => (params.value == null ? undefined : params.value))
  public type!: 'seoul' | 'gyeonggi' | 'data.seoul'; // api type

  /* 제외 속성 */
  @Transform(params => (params.value = undefined))
  createdAt!: Date;

  @Transform(params => (params.value = undefined))
  updatedAt!: Date;

  @Transform(params => (params.value = undefined))
  bmGroupId!: string;

  @Transform(params => (params.value = undefined))
  bmGroupName!: string;

  @Transform(params => (params.value = undefined))
  bmGroupBookMarkId!: string;
}
