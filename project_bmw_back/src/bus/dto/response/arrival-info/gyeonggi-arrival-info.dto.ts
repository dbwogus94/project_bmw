import { ArrivalInfo } from './arrival-info.interface';
import dateToString from '@shared/date-to-string';

export class GyeonggiArrivalInfo implements ArrivalInfo {
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

  constructor(data?: any | undefined) {
    data ? this.setFields(data) : this.setFieldsWhenNull();
  }

  setFields(data: any) {
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
    } = data;

    this.routeId = routeId;
    this.stationId = stationId;
    this.stationSeq = staOrder;
    /* */
    this.firstLocation = locationNo1;
    this.firstTime = predictTime1;
    this.isFirstRow = lowPlate1 === '1' ? true : false;
    /* */
    this.secondLocation = locationNo2;
    this.secondTime = predictTime2;
    this.isSecondRow = lowPlate2 === '1' ? true : false;
    /* */
    this.serverTime = `${dateToString('HH:mm')} 기준`; // 'HH시 mm분'
    this.isFirstActive = true; // 운행여부
    this.firstMessage = `약 ${predictTime1}분 후 도착[${locationNo1}번째 전]`;
    // this.isFirstLast = false; // 첫번째 도착 예정 버스 막차 여부 ?
    this.isSecondActive = true; // 운행 여부
    this.secondMessage = `약 ${predictTime2}분 후 도착[${locationNo2}번째 전]`;
    // this.isSecondLast = false; // 두번째 도착 예정 시간 막차 여부 ?
  }

  setFieldsWhenNull() {
    this.routeId = '';
    this.stationId = '';
    this.stationSeq = '';
    /* */
    this.firstLocation = '';
    this.firstTime = '';
    this.isFirstRow = null;
    /* */
    this.secondLocation = '';
    this.secondTime = '';
    this.isSecondRow = null;
    /* */
    this.serverTime = `${dateToString('HH:mm')} 기준`; // 'HH시 mm분'
    this.isFirstActive = false; // 운행여부
    this.firstMessage = '운행종료';
    // this.isFirstLast = false; // 첫번째 도착 예정 버스 막차 여부 ?
    this.isSecondActive = false; // 운행 여부
    this.secondMessage = '운행종료';
  }
}
