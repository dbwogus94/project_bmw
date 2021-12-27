import { Info } from './info.interface';

/**
 * 경기도 Open API 버스노선 상세정보 조회 결과 DTO
 *  - 서비스명: 버스노선조회(REST)
 *  - 오퍼레이션명(국문): 노선정보항목조회
 *  - 오퍼레이션명(영문): getBusRouteInfoItem
 */
export class GyeonggiBusInfoDto implements Info {
  // 노선 ID(routeId)
  routeId: number;
  // 노선 번호(routeName)
  routeName: string;
  // 기점정류소명(startStationName)
  startStationName: string;
  // 종점정류소명(endStationName)
  endStationName: string;
  // 노선유형코드(routeTypeCd)
  routeTypeCd: number;
  // 노선유형명(routeTypeName)
  routeTypeName: string;
  // 노선운행지역명(regionName)
  regionName: string;
  // 관할지역코드(districtCd)
  districtCd: number;
  // 관할지역명(districtName)
  districtName: '서울' | '경기' | '인천';
  // 최소배차시간(peekAlloc)
  minTerm: number;
  // 최대배차시간(nPeekAlloc)
  maxTerm: number;
  // 운수업체ID(companyId)
  companyId: number | null;
  // 운수업체명(companyName)
  companyName: Number;
  // 운수업체전화번호(companyTel)
  companyTel: string;
  // 서울, 경기 구분 라벨
  type: 'seoul' | 'gyeonggi';

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

    this.routeId = routeId;
    this.routeName = routeName;
    this.startStationName = startStationName;
    this.endStationName = endStationName;
    this.routeTypeCd = routeTypeCd;
    this.routeTypeName = routeTypeName;
    this.regionName = regionName;
    this.districtCd = districtCd;
    this.districtName = this.getDistrictName(districtCd);
    this.minTerm = peekAlloc;
    this.maxTerm = nPeekAlloc;
    // 운수 회사
    this.companyId = companyId;
    this.companyName = companyName;
    this.companyTel = companyTel;
    this.type = 'gyeonggi';
    // 막차 첫차 시간
    this.upFirstTime = upFirstTime;
    this.upLastTime = upLastTime;
    this.downFirstTime = downFirstTime;
    this.downLastTime = downLastTime;
  }

  // TODO: 공통으로 이동 예정
  getDistrictName(districtCd: number) {
    switch (districtCd) {
      case 1:
        return '서울';
      case 2:
        return '경기';
      case 3:
        return '인천';
      default:
        throw Error('[GyeonggiBusDto] 유효하지 않은 districtCd 입니다.');
    }
  }
}
