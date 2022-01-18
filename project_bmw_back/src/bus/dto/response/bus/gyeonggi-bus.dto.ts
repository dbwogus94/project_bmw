import { BusDto } from '@src/bus/dto/response/bus/bus.dto';
/**
 * 경기도 Open API 노선번호목록조회 결과 DTO
 *  - 서비스명: 버스노선조회(REST)
 *  - 오퍼레이션명(국문): 노선번호목록조회
 *  - 오퍼레이션명(영문): getBusRouteList
 */
export class GyeonggiBusDto extends BusDto {
  constructor(gyeonggiBusData: any) {
    const { routeId, routeName, routeTypeCd, routeTypeName, districtCd } = gyeonggiBusData;
    super(routeId, routeName, routeTypeCd, routeTypeName, districtCd, 'gyeonggi');
  }
}
