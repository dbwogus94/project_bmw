import { Metro } from '@metro/entities/Metro.entity';
import { dateToString } from '@shared/util';

export class MetroArrivalDto {
  routeId: number;
  stationId: number;
  inOutTag: string;
  serverTime: string; // 서버 시간
  /* */
  firstTime: number; // 첫번째 지하철 도착 시간(분)
  isFirstActive: boolean; // 첫번째 지하철 운행 여부
  firstState: '운행중' | '출발대기' | '운행종료' | '지원예정';
  firstDestStationName: String; // 첫번째 지하철 종점
  isFirstExpress: boolean; // 첫번쨰 지하철 급행 여부
  /* */
  secondTime: number; // 두번째 지하철 도착 시간(분)
  secondDestStationName: string; // 두번째 지하철 종점
  isSecondActive: boolean; // 두번째 지하철 운행 여부
  isSecondExpress: boolean;
  secondState: '운행중' | '출발대기' | '운행종료' | '지원예정';

  constructor(data: any) {
    const {
      routeId,
      stationId,
      inOutTag,
      serverTime,
      firstTime,
      isFirstActive,
      firstState,
      firstDestStationName,
      isFirstExpress,
      secondTime,
      isSecondActive,
      secondState,
      secondDestStationName,
      isSecondExpress,
    } = data;

    this.routeId = routeId;
    this.stationId = stationId;
    this.inOutTag = inOutTag;
    this.serverTime = serverTime;
    //
    this.firstTime = firstTime;
    this.isFirstActive = isFirstActive;
    this.firstState = firstState;
    this.firstDestStationName = firstDestStationName;
    this.isFirstExpress = isFirstExpress;
    this.secondTime = secondTime;
    this.secondDestStationName = secondDestStationName;
    this.isSecondActive = isSecondActive;
    this.isSecondExpress = isSecondExpress;
    this.secondState = secondState;
  }

  public static entityToDto(entity: Metro) {
    const { routeId, metroStations } = entity!;
    const { stationId, metroTimetables } = metroStations[0];

    return new MetroArrivalDto({
      routeId,
      stationId,
      inOutTag: metroTimetables[0].inOutTag,
      serverTime: dateToString('HH:mm'),
      //
      firstTime: diffTimeToMinute(metroTimetables[0].arriveTime),
      isFirstActive: true,
      firstState: '운행중',
      firstDestStationName: metroTimetables[0].destStationName,
      isFirstExpress: metroTimetables[0].expressTag === 'D' ? true : false,
      //
      secondTime: diffTimeToMinute(metroTimetables[1].arriveTime),
      isSecondActive: true,
      secondState: '운행중',
      secondDestStationName: metroTimetables[1].destStationName,
      isSecondExpress: metroTimetables[1].expressTag === 'D' ? true : false,
    });

    function diffTimeToMinute(arriveTime: string) {
      const tarrive = Date.parse(`${dateToString('YYYY-MM-DD')} ${arriveTime}`); //.setHours(9);
      const tnow = Date.now();
      return Math.floor((tarrive - tnow) / (1000 * 60));
    }
  }

  public static nullToDto(routeId: number, stationId: number, inOutTag: string) {
    return new MetroArrivalDto({
      routeId,
      stationId,
      inOutTag,
      serverTime: dateToString('HH:mm'),
      //
      firstTime: 100000,
      isFirstActive: false,
      firstState: '지원예정',
      firstDestStationName: '',
      isFirstExpress: false,
      //
      secondTime: 10000,
      isSecondActive: false,
      secondState: '지원예정',
      secondDestStationName: '',
      isSecondExpress: false,
    });
  }
}
