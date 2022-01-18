import { BusInfoDto } from './info.dto';

/**
 * 경기도 Open API 버스노선 상세정보 조회 결과 DTO
 *  - 서비스명: 버스노선조회(REST)
 *  - 오퍼레이션명(국문): 노선정보항목조회
 *  - 오퍼레이션명(영문): getBusRouteInfoItem
 */
export class GyeonggiBusInfoDto extends BusInfoDto {
  /* 경기도만 있는 데이터 */
  // 평일기점 첫차시간
  upFirstTime: string;
  // 평일기점 막차시간
  upLastTime: string;
  // 평일종점 첫차시간
  downFirstTime: string;
  // 평일종점 막차시간
  downLastTime: string;

  constructor(gyeonggiBusInfoData: any) {
    const {
      routeId,
      routeName,
      startStationName,
      endStationName,
      routeTypeCd,
      routeTypeName,
      regionName,
      districtCd,
      peekAlloc,
      nPeekAlloc,
      companyId,
      companyName,
      companyTel,
      upFirstTime,
      upLastTime,
      downFirstTime,
      downLastTime,
    } = gyeonggiBusInfoData;

    super(
      routeId,
      routeName,
      startStationName,
      endStationName,
      routeTypeCd,
      routeTypeName,
      regionName,
      districtCd,
      peekAlloc,
      nPeekAlloc,
      companyId,
      companyName,
      companyTel,
      'gyeonggi',
    );

    // 막차 첫차 시간
    this.upFirstTime = upFirstTime;
    this.upLastTime = upLastTime;
    this.downFirstTime = downFirstTime;
    this.downLastTime = downLastTime;
  }
}
