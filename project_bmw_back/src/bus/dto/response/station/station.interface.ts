/**
 * Info interface는
 * Open API 버스노선 상세정보 조회 결과에서
 * 공통으로 사용될 필드를 강제하기 위해 사용된다.
 * 1. 서울시:
 *    - 서비스명: 노선정보조회 서비스
 *    - 오퍼레이션명(국문): 노선별경유정류소목록조회
 *    - 오퍼레이션명(영문): getStaionsByRouteList
 * 2. 경기도:
 *    - 서비스명: 버스노선조회(REST)
 *    - 오퍼레이션명(국문): 경유정류소목록조회
 *    - 오퍼레이션명(영문): getBusRouteStationList
 */
export interface Station {
  // 정류소고유번호: 서울시는 이 값으로 정류소 상세 데이터를 받아온다.
  arsId: string | number;
  // 정류소ID: 경기도 이 값으로 정류소 상세 데이터 받아온다.
  stationId: string | number;
  // 정류소명
  stationName: string;
  // 정류소순번
  stationSeq: string | number;
  // 회차지여부(Y: 회차지)
  turnYn: 'Y' | 'N';
  // 노선 ID
  routeId: number;
  // 사용된 API 구분 라벨
  type: 'seoul' | 'gyeonggi';
}
