/**
 * Info interface는
 * Open API 버스노선 상세정보 조회 결과에서
 * 공통으로 사용될 필드를 강제하기 위해 사용된다.
 * 1. 서울시:
 *    - 서비스명: 노선정보조회 서비스
 *    - 오퍼레이션명(국문): 노선기본정보항목조회
 *    - 오퍼레이션명(영문): getRouteInfoItem
 * 2. 경기도:
 *    - 서비스명: 버스노선조회(REST)
 *    - 오퍼레이션명(국문): 노선정보항목조회
 *    - 오퍼레이션명(영문): getBusRouteInfoItem
 */
export interface Info {
  // 노선 ID
  routeId: number;
  // 노선 번호
  routeName: string;
  // 기점정류소명
  startStationName: string;
  // 종점정류소명
  endStationName: string;
  // 노선유형코드
  routeTypeCd: number;
  // 노선유형명
  routeTypeName: string;
  // 노선운행지역명
  regionName: string;
  // 관할지역코드
  districtCd: number;
  // 관할지역명
  districtName: '서울' | '경기' | '인천';
  // 최소배차시간
  minTerm: number;
  // 최대배차시간
  maxTerm: number;
  // 운수업체ID
  companyId: number | null;
  // 운수업체명
  companyName: Number;
  // 운수업체전화번호
  companyTel: string;
  // 사용된 API 구분 라벨
  type: 'seoul' | 'gyeonggi';
}
