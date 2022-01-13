import { Arrival } from './arrival-interface';
import dateToString from '@shared/date-to-string';

export class GyeonggiArrivalDto implements Arrival {
  routeId?: string;
  stationId?: string;
  stationSeq?: string;
  serverTime?: string; // 서버 시간
  /* */
  firstLocation?: number; // 첫번째 버스 위치
  firstTime?: number; // 첫번째 버스 도착 시간(분)
  isFirstRow?: boolean; // 첫번째 버스 저상버스 여부
  isFirstActive?: boolean; // 첫번째 버스 운행 여부
  firstState?: '운행중' | '곧 도착' | '출발대기' | '운행종료';
  /* */
  secondLocation?: number; // 두번째 버스 위치
  secondTime?: number; // 두번째 버스 도착 시간(분)
  isSecondRow?: boolean; // 두번째 버스 저상버스 여부
  isSecondActive?: boolean; // 두번째 버스 운행 여부
  secondState?: '운행중' | '곧 도착' | '출발대기' | '운행종료';

  constructor(data: any) {
    data.flag === 'STOP' ? this.setFieldsByStop(data) : this.setFields(data);
  }

  private setFields(data: any) {
    const {
      routeId, // 노선id
      stationId, // 경유 정류소 id
      staOrder, // 노선 경유 정류소 순번
      locationNo1, // 첫번째 버스가 조회한 정류소부터 몇 번째 전 정류장에 위치하는지 숫자 정보
      predictTime1, // 첫번쨰 버스의 도착 예정 시간(분)
      lowPlate1, // 첫번째 버스의 버스 타입, (0: 일반, 1: 저상)
      locationNo2,
      predictTime2,
      lowPlate2,
      flag,
    } = data;

    this.routeId = routeId;
    this.stationId = stationId;
    this.stationSeq = staOrder;

    /* 노선 상태 설정 */
    this.firstState = this.getState(locationNo1);
    this.secondState = this.getState(locationNo2);

    this.isFirstActive = true; // 운행여부
    this.isSecondActive = true;
    /* */
    this.firstLocation = Number(locationNo1);
    this.firstTime = Number(predictTime1);
    this.isFirstRow = lowPlate1 === '1' ? true : false;
    /* */
    this.secondLocation = Number(locationNo2);
    this.secondTime = Number(predictTime2);
    this.isSecondRow = lowPlate2 === '1' ? true : false;
    /* */
    this.serverTime = `${dateToString('HH:mm')}`; // 'HH시 mm분'
  }

  private setFieldsByStop(data: any) {
    const { routeId, stationId, stationSeq } = data;
    this.routeId = routeId;
    this.stationId = stationId;
    this.stationSeq = stationSeq;

    this.firstState = '운행종료';
    this.secondState = '운행종료';
    /* */
    this.isFirstActive = false; // 운행여부
    this.isSecondActive = false;
    /* */
    this.firstLocation = 0;
    this.firstTime = 0;
    this.isFirstRow = false;
    /* */
    this.secondLocation = 0;
    this.secondTime = 0;
    this.isSecondRow = false;
    /* */
    this.serverTime = `${dateToString('HH:mm')}`; // 'HH시 mm분'
  }

  /**
   * 버스 노선의 상태를 리턴
   * - '운행중' | '출발대기' | '곧 도착'
   * @param locationNo 몇 번째 전 정류장에 위치하는지 숫자 정보
   * @returns
   */
  private getState(locationNo: string): '운행중' | '출발대기' | '곧 도착' {
    if (locationNo === '') {
      return '출발대기';
    } else if (locationNo === '1') {
      return '곧 도착';
    } else {
      return '운행중';
    }
  }
}