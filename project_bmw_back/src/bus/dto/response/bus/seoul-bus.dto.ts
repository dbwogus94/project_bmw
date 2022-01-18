import { BusDto } from '@src/bus/dto/response/bus/bus.dto';
import { getRouteTypeName } from '@src/shared/util';
/**
 * 서울시 Open API 노선번호목록조회 결과 DTO
 *  - 서비스명: 노선정보조회 서비스
 *  - 오퍼레이션명(국문): 노선번호목록조회
 *  - 오퍼레이션명(영문): getBusRouteList
 */
export class SeoulBusDto extends BusDto {
  constructor(seoulBusData: any) {
    const { busRouteId, busRouteNm, routeType } = seoulBusData;
    super(busRouteId, busRouteNm, routeType, getRouteTypeName(routeType), 1, 'seoul');
  }
}
