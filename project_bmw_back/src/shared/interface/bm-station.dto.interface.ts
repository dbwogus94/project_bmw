export interface BmStationDto {
  // 노선 ID
  routeId: number;
  // 경기도: 고유모바일번호(mobileNo) / 서울시: 정류소 고유번호(arsId), 서울시 지하철: 외부 코드(stationFrCode)
  arsId: string;
  // 정류소ID: 경기도 이 값으로 정류소 상세 데이터 받아온다.
  stationId: string | number;
  // 정류소명
  stationName: string;
  // 정류소순번
  stationSeq: string | number;
  // 운행 방향
  direction: string;
  // 회차지여부(Y: 회차지)
  turnYn: 'Y' | 'N';
  // 상행(1) 하행(2) 여부
  inOutTag: '1' | '2';
  // 타입
  label: 'B' | 'M' | 'S';
  // 사용된 API 구분 라벨
  type: 'seoul' | 'gyeonggi' | 'data.seoul';
}
