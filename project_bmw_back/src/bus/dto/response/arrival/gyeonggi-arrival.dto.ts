import { ArrivalDto } from './arrival.dto';
import { DateUtil } from '@shared/util';

export class GyeonggiArrivalDto extends ArrivalDto {
  constructor(data: any) {
    const {
      routeId,
      stationId,
      stationSeq,
      serverTime,
      //
      firstLocation,
      firstTime,
      isFirstRow,
      isFirstActive,
      firstState,
      //
      secondLocation,
      secondTime,
      isSecondRow,
      isSecondActive,
      secondState,
    } = data.flag === 'STOP' ? setFieldsByStop(data) : setFields(data);

    super(
      routeId,
      stationId,
      stationSeq,
      serverTime,
      //
      firstLocation,
      firstTime,
      isFirstRow,
      isFirstActive,
      getState(firstState),
      //
      secondLocation,
      secondTime,
      isSecondRow,
      isSecondActive,
      getState(secondState),
    );

    function setFields(data: any) {
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

      return {
        routeId,
        stationId,
        stationSeq: staOrder,
        serverTime: `${DateUtil.dateToString('HH:mm')}`,
        //
        firstLocation: Number(locationNo1),
        firstTime: Number(predictTime1),
        isFirstRow: lowPlate1 === '1' ? true : false,
        isFirstActive: true,
        firstState: locationNo1,
        //
        secondLocation: Number(locationNo2),
        secondTime: Number(predictTime2),
        isSecondRow: lowPlate2 === '1' ? true : false,
        isSecondActive: true,
        secondState: locationNo2,
      };
    }

    function setFieldsByStop(data: any) {
      const { routeId, stationId, stationSeq } = data;
      return {
        routeId,
        stationId,
        stationSeq,
        serverTime: `${DateUtil.dateToString('HH:mm')}`,
        /* */
        firstLocation: 0,
        firstTime: 100000,
        isFirstRow: false,
        isFirstActive: false, // 운행여부
        firstState: '운행종료',
        /* */
        secondLocation: 0,
        secondTime: 100000,
        isSecondRow: false,
        isSecondActive: false,
        secondState: '운행종료',
      };
    }

    /**
     * 버스 노선의 상태를 리턴
     * - '운행중' | '출발대기' | '곧 도착'
     * @param locationNo 몇 번째 전 정류장에 위치하는지 숫자 정보
     * @returns
     */
    function getState(locationNo: string): '운행중' | '곧 도착' | '출발대기' | '운행종료' {
      if (locationNo === '') {
        return '출발대기';
      } else if (locationNo === '1') {
        return '곧 도착';
      } else if (locationNo === '운행종료') {
        return '운행종료';
      } else {
        return '운행중';
      }
    }
  }
}
