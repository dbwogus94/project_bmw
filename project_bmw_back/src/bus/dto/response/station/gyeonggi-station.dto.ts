import { BusStationDto } from './station.dto';

/**
 * 경기도 Open API 경유정류소목록조회 결과 DTO
 *  - 서비스명: 버스노선조회(REST)
 *  - 오퍼레이션명(국문): 경유정류소목록조회
 *  - 오퍼레이션명(영문): getBusRouteStationList
 */
export class GyeonggiBusStationDto extends BusStationDto {
  constructor(gyeonggiStationData: any) {
    const { routeId, mobileNo, stationId, stationName, stationSeq, direction, turnYn, inOutTag } = gyeonggiStationData;
    super(routeId, mobileNo, stationId, stationName, stationSeq, direction, turnYn, inOutTag, 'gyeonggi');
  }
}
