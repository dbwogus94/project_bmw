export interface Station {
  // 정류소 고유번호: 서울시는 이 값으로 정류소 상세 데이터를 받아온다.
  arsId: string | number;
  // 정류소 ID: 경기도 이 값으로 정류소 상세 데이터 받아온다.
  stationId: string | number;
  // 정류소 명
  stationName: string;
  // 정류소 순번
  stationSeq: string | number;
  // 회차지 여부(Y: 회차지)
  turnYn: 'Y' | 'N';
  // 조회에 사용된 노선 ID
  routeId: number;
}
