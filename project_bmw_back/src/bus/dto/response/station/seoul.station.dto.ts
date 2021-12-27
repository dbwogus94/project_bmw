import { Station } from './station.interface';

/**
 * 서울시 Open API 노선별경유정류소목록조회 결과 DTO
 *  - 서비스명: 노선정보조회 서비스
 *  - 오퍼레이션명(국문): 노선별경유정류소목록조회
 *  - 오퍼레이션명(영문): getStaionsByRouteList
 */
export class SeoulBusStationDto implements Station {
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
  // 사용된 API 구분 라벨
  type: 'seoul' | 'gyeonggi';

  constructor(seoulStationData: any) {
    const { arsId, station, stationNm, seq, transYn, busRouteId } = seoulStationData;
    this.arsId = arsId;
    this.stationId = station;
    this.stationName = stationNm;
    this.stationSeq = seq;
    this.turnYn = transYn;
    this.routeId = busRouteId;
    this.type = 'seoul';
  }
}
