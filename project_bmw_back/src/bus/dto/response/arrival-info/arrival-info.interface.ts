export interface ArrivalInfo {
  routeId?: string;
  stationId?: string;
  stationSeq?: string;
  serverTime?: string; // 서버 시간
  /* */
  firstLocation?: string; // 첫번째 버스 위치
  firstTime?: string; // 첫번째 버스 도착 시간(분)
  isFirstRow?: boolean | null; // 첫번째 버스 저상버스 여부
  // isFirstLast?: boolean | null; // 첫번째 버스 막차 여부
  isFirstActive?: boolean | null; // 첫번째 버스 운행 여부
  firstMessage?: string; // 첫번째 버스 도착 메세지 ex) 5분전[2번째전]
  /* */
  secondLocation?: string; // 두번째 버스 위치
  secondTime?: string; // 두번째 버스 도착 시간(분)
  isSecondRow?: boolean | null; // 두번째 버스 저상버스 여부
  // isSecondLast?: boolean | null; // 두번째 버스 막차 여부
  isSecondActive?: boolean | null; // 두번째 버스 운행 여부
  secondMessage?: string; // 두번째 버스 도착 메세지 ex) 10분전[4번째전]
}
