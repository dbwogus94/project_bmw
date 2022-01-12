import dateToString from '@shared/date-to-string';
import { Arrival } from './arrival-interface';

export class SeoulArrivalDto implements Arrival {
  routeId?: string;
  stationId?: string;
  stationSeq?: string;
  serverTime?: string; // 서버 시간
  /* */
  firstLocation?: number; // 첫번째 버스 위치
  firstTime?: number; // 첫번째 버스 도착 시간(분)
  isFirstRow?: boolean; // 첫번째 버스 저상버스 여부
  isFirstActive?: boolean; // 첫번째 버스 운행 여부
  /* */
  secondLocation?: number; // 두번째 버스 위치
  secondTime?: number; // 두번째 버스 도착 시간(분)
  isSecondRow?: boolean; // 두번째 버스 저상버스 여부
  isSecondActive?: boolean; // 두번째 버스 운행 여부

  constructor(data: any) {
    const {
      busRouteId, // 노선 id
      stId, // 경유 정류소 id
      staOrd, // 경유 정류소 순번
      kals1, // 첫번째 차량 도착예상 시간(초)
      busType1, // 버스 타입(0: 일반버스, 1: 저상버스)
      kals2, // 두번째 차량 도착예상 시간(초)
      busType2, // 버스 타입(0: 일반버스, 1: 저상버스)
      isArrive1, // 첫번째 차량 운행 여부
      isArrive2,
      sectOrd1,
      sectOrd2,
    } = data;

    this.routeId = busRouteId;
    this.stationId = stId;
    this.stationSeq = staOrd;
    /* */
    this.firstLocation = this.nextLocationNo(Number(staOrd), Number(sectOrd1));
    this.firstTime = this.nextLocationTime(kals1);
    this.isFirstRow = busType1 === 1 ? true : false;
    /* */
    this.secondLocation = this.nextLocationNo(Number(staOrd), Number(sectOrd2));
    this.secondTime = this.nextLocationTime(kals2);
    this.isSecondRow = busType2 === 1 ? true : false;
    /* */
    this.serverTime = `${dateToString('HH:mm')} 기준`; // 'HH시 mm분'
    this.isFirstActive = isArrive1 === 0 || isArrive1 === 1 ? true : false; // 운행여부, TODO 확인 필요
    this.isSecondActive = isArrive2 === 0 || isArrive2 === 1 ? true : false;
  }

  /**
   * 도착 예정 버스가 몇 번째 정류장 전에 있는지 계산
   * @param staOrd - 조회 요청한 버스의 정류장 순번
   * @param sectOrd - 도착 에정 버스의 정유장 순번
   * @returns
   */
  private nextLocationNo(staOrd: number, sectOrd: number): number {
    return sectOrd === 0 ? staOrd - sectOrd : 0;
  }

  /**
   * 초 단위로 들어오는 예정시간 분 단위로 변경
   * - 초단위 정확하지 않아 버림 처리
   * @param kals
   * @returns
   */
  private nextLocationTime(kals: number): number {
    if (kals === 0) {
      return 0;
    }

    if (kals < 60) {
      return 1; // 1분
    }

    return Math.floor(kals / 60); // 초 단위 버림
  }
}
