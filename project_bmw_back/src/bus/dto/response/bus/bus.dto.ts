import { getDistrictName } from '@src/shared/util';

/**
 * Info interface는
 * Open API 버스노선 상세정보 조회 결과에서
 * 공통으로 사용될 필드를 강제하기 위해 사용된다.
 * 1. 서울시:
 *    - 서비스명: 노선정보조회 서비스
 *    - 오퍼레이션명(국문): 노선번호목록조회
 *    - 오퍼레이션명(영문): getBusRouteList
 * 2. 경기도:
 *    - 서비스명: 버스노선조회(REST)
 *    - 오퍼레이션명(국문): 노선번호목록조회
 *    - 오퍼레이션명(영문): getBusRouteList
 */
export class BusDto {
  // 버스ID(숫자 일련번호)
  routeId!: number;
  // 버스이름(노선 번호)
  routeName!: string;
  // 노선유형코드
  routeTypeCd!: number;
  // 노선유형명
  routeTypeName!: string;
  // 관할지역코드
  districtCd!: number;
  // 관할지역명
  districtName!: '서울' | '경기' | '인천';
  // 사용된 API 구분 라벨
  type!: 'seoul' | 'gyeonggi' | 'data.seoul';
  // 라벨: B(버스)
  label: 'B' = 'B';

  constructor(
    routeId: number,
    routeName: string,
    routeTypeCd: number,
    routeTypeName: string,
    districtCd: number,
    type: 'seoul' | 'gyeonggi' | 'data.seoul',
  ) {
    this.routeId = routeId;
    this.routeName = routeName;
    this.routeTypeCd = routeTypeCd;
    this.routeTypeName = routeTypeName;
    this.districtCd = districtCd;
    this.districtName = getDistrictName(districtCd, type);
    this.type = type;
  }
}
