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
  isFirstArrive?: boolean; // 첫번째 버스 도착 여부
  firstState?: '운행중' | '곧 도착' | '출발대기' | '운행종료';
  /* */
  secondLocation?: number; // 두번째 버스 위치
  secondTime?: number; // 두번째 버스 도착 시간(분)
  isSecondRow?: boolean; // 두번째 버스 저상버스 여부
  isSecondActive?: boolean; // 두번째 버스 운행 여부
  isSecondArrive?: boolean; // 두번째 버스 도착 여부
  secondState?: '운행중' | '곧 도착' | '출발대기' | '운행종료';

  constructor(data: any) {
    const {
      arrmsg1, // "운행종료"면 디폴트 값으로
      arrmsg2,
      busRouteId, // 노선 id
      stId, // 경유 정류소 id
      staOrd, // 경유 정류소 순번
      kals1, // 첫번째 차량 도착예상 시간(초)
      busType1, // 버스 타입(0: 일반버스, 1: 저상버스)
      kals2, // 두번째 차량 도착예상 시간(초)
      busType2, // 버스 타입(0: 일반버스, 1: 저상버스)
      isArrive1, // 운행중(0, 도착(1)
      isArrive2,
      sectOrd1,
      sectOrd2,
      mkTm,
    } = data;

    /* 버스 기본정보 : 서울시는 운행중이지 않아도 데이터가 들어온다. */
    this.routeId = busRouteId;
    this.stationId = stId;
    this.stationSeq = staOrd;

    /* 노선 상태 설정 */
    this.firstState = this.getState(arrmsg1);
    this.secondState = this.getState(arrmsg2);

    /* 운행중 확인: API 상태코드 맞지 않기 때문에 arrmsg1 값으로 설정  */
    this.isSecondActive = arrmsg2 !== '운행종료' ? true : false;
    this.isFirstActive = arrmsg1 !== '운행종료' ? true : false;

    /* 첫번째 도착 버스 */
    this.firstLocation = this.isFirstActive ? this.nextLocationNo(Number(staOrd), Number(sectOrd1)) : 0;
    this.firstTime = this.isFirstActive ? this.nextLocationTime(kals1) : 0;
    this.isFirstRow = busType1 === '1' ? true : false;
    this.isFirstArrive = isArrive1 === '1' ? true : false;
    /* 두번째 도착 버스 */
    this.secondLocation = this.isFirstActive ? this.nextLocationNo(Number(staOrd), Number(sectOrd2)) : 0;
    this.secondTime = this.isFirstActive ? this.nextLocationTime(kals2) : 0;
    this.isSecondRow = busType2 === '1' ? true : false;
    this.isSecondArrive = isArrive2 === '1' ? true : false;
    /* 서울시의 경우 제공시각을 제공함: 2021-11-14 22:44:03.0 */
    this.serverTime = `${dateToString('HH:mm', new Date(Date.parse(mkTm)))}`; // 'HH시 mm분'
  }

  /**
   * 버스 노선의 상태를 리턴
   * - '운행중' | '곧 도착' | '출발대기' | '운행종료'
   * @param arrmsg 도착정보메시지
   * @returns
   */
  private getState(arrmsg: string): '운행중' | '곧 도착' | '출발대기' | '운행종료' {
    if (arrmsg === '운행종료') {
      return '운행종료';
    } else if (arrmsg === '출발대기') {
      return '출발대기';
    } else if (arrmsg === '곧 도착') {
      return '곧 도착';
    } else {
      // 운행중일 떄만 몇분 남았는지 보이기
      return '운행중';
    }
  }

  /**
   * 도착 예정 버스가 몇 번째 정류장 전에 있는지 계산
   * @param staOrd - 조회 요청한 버스의 정류장 순번
   * @param sectOrd - 도착 에정 버스의 정유장 순번
   * @returns
   */
  private nextLocationNo(staOrd: number, sectOrd: number): number {
    return staOrd - sectOrd;
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
