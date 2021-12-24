import { Station } from './station.dto.interface';

export class SeoulStationDto implements Station {
  // 정류장_고유번호(arsId): 서울시는 고유번호를 통해 서울시 정류소 조회 API와 연결이 가능하다.
  arsId: string | number;
  // 정류장_ID(station)
  stationId: string | number;
  // 정류장_이름(stationNm)
  stationName: string;
  // 정류소_순번(seq)
  stationSeq: string | number;
  // 회차지_여부(transYn)
  turnYn: 'Y' | 'N';
  // 버스ID(busRouteId) 조회에 사용된 버스 ID
  routeId: number;

  constructor(seoulStationData: any) {
    const { arsId, station, stationNm, seq, transYn, busRouteId } = seoulStationData;
    this.arsId = arsId;
    this.stationId = station;
    this.stationName = stationNm;
    this.stationSeq = seq;
    this.turnYn = transYn;
    this.routeId = busRouteId;
  }
}
