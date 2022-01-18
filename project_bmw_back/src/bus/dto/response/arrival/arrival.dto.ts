export class ArrivalDto {
  routeId: string;
  stationId: string;
  stationSeq: string;
  serverTime: string; // 서버 시간
  /* */
  firstLocation: number; // 첫번째 버스 위치
  firstTime: number; // 첫번째 버스 도착 시간(분)
  isFirstRow: boolean; // 첫번째 버스 저상버스 여부
  isFirstActive: boolean; // 첫번째 버스 운행 여부
  firstState: '운행중' | '곧 도착' | '출발대기' | '운행종료';
  /* */
  secondLocation: number; // 두번째 버스 위치
  secondTime: number; // 두번째 버스 도착 시간(분)
  isSecondRow: boolean; // 두번째 버스 저상버스 여부
  isSecondActive: boolean; // 두번째 버스 운행 여부
  secondState: '운행중' | '곧 도착' | '출발대기' | '운행종료';

  constructor(
    routeId: string,
    stationId: string,
    stationSeq: string,
    serverTime: string,
    //
    firstLocation: number,
    firstTime: number,
    isFirstRow: boolean,
    isFirstActive: boolean,
    firstState: '운행중' | '곧 도착' | '출발대기' | '운행종료',
    //
    secondLocation: number,
    secondTime: number,
    isSecondRow: boolean,
    isSecondActive: boolean,
    secondState: '운행중' | '곧 도착' | '출발대기' | '운행종료',
  ) {
    this.routeId = routeId;
    this.stationId = stationId;
    this.stationSeq = stationSeq;
    this.serverTime = serverTime;
    this.firstLocation = firstLocation;
    this.firstTime = firstTime;
    this.isFirstRow = isFirstRow;
    this.isFirstActive = isFirstActive;
    this.firstState = firstState;
    this.secondLocation = secondLocation;
    this.secondTime = secondTime;
    this.isSecondRow = isSecondRow;
    this.isSecondActive = isSecondActive;
    this.secondState = secondState;
  }
}
