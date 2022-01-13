export interface Arrival {
  routeId?: string;
  stationId?: string;
  stationSeq?: string;
  serverTime?: string; // 서버 시간
  /* */
  firstLocation?: number; // 첫번째 버스 위치
  firstTime?: number; // 첫번째 버스 도착 시간(분)
  isFirstRow?: boolean; // 첫번째 버스 저상버스 여부
  // isFirstLast?: boolean; // 첫번째 버스 막차 여부 - 서울 제공, 경기도 미제공
  isFirstActive?: boolean; // 첫번째 버스 운행 여부
  isFirstArrive?: boolean; // 첫번째 버스 도착 여부
  firstState?: '운행중' | '곧 도착' | '출발대기' | '운행종료';
  /* */
  secondLocation?: number; // 두번째 버스 위치
  secondTime?: number; // 두번째 버스 도착 시간(분)
  isSecondRow?: boolean; // 두번째 버스 저상버스 여부
  // isSecondLast?: boolean; // 두번째 버스 막차 여부 - 서울 제공, 경기도 미제공
  isSecondActive?: boolean; // 두번째 버스 운행 여부
  isSecondArrive?: boolean; // 두번째 버스 도착 여부
  secondState?: '운행중' | '곧 도착' | '출발대기' | '운행종료';
}
