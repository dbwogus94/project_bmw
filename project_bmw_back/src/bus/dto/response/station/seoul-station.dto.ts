import { BusStationDto } from './station.dto';

/**
 * 서울시 Open API 노선별경유정류소목록조회 결과 DTO
 *  - 서비스명: 노선정보조회 서비스
 *  - 오퍼레이션명(국문): 노선별경유정류소목록조회
 *  - 오퍼레이션명(영문): getStaionsByRouteList
 */
export class SeoulBusStationDto extends BusStationDto {
  constructor(seoulStationData: any) {
    const { busRouteId, arsId, station, stationNm, seq, direction, transYn, inOutTag } = seoulStationData;
    super(busRouteId, arsId, station, stationNm, seq, direction, transYn, inOutTag, 'seoul');
  }
}
