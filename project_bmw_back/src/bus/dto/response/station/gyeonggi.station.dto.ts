import { Station } from './station.dto.interface';

export class GyeonggiStationDto implements Station {
  // 정류소_고유번호(x): 경기도는 결과에 없는 필드로 stationId와 같은 데이터를 넣는다.
  arsId: string | number;
  // 정류소_ID(stationId): 경기도는 stationId를 사용하여 경기도_정류소_조회 API와 연결이 가능하다.
  stationId: string | number;
  // 정류소_이름(stationName)
  stationName: string;
  // 정류소_순번(stationSeq)
  stationSeq: string | number;
  // 회차지_여부(turnYn)
  turnYn: 'Y' | 'N';
  // 버스ID(x): 조회에 사용된 버스ID
  routeId: number;

  constructor(routeId: number | number, gyeonggiStationData: any) {
    const { stationId, stationName, stationSeq, turnYn } = gyeonggiStationData;
    this.arsId = stationId;
    this.stationId = stationId;
    this.stationName = stationName;
    this.stationSeq = stationSeq;
    this.turnYn = turnYn;
    this.routeId = routeId;
  }
}
