import { getRouteTypeName } from '@src/shared/util';
import { BusDto } from './bus.dto';

/**
 * 서울시 Open API 노선번호목록조회 결과 DTO
 *  - 서비스명: 노선정보조회 서비스
 *  - 오퍼레이션명(국문): 노선번호목록조회
 *  - 오퍼레이션명(영문): getBusRouteList
 */
export class SeoulBusDto extends BusDto {
  constructor(seoulBusData: any) {
    const { busRouteId, busRouteNm, routeType } = seoulBusData;
    const busRouteType = routeType ? routeType : seoulBusData.busRouteType;
    super(busRouteId, busRouteNm, busRouteType, getRouteTypeName(busRouteType), 1, 'seoul');
  }
}
