import { Bus } from '@bus/dto/response/bus.dto.interface';

export interface BusService {
  // 버스번호와 일치하는 버스 검색
  getBusListByRouteName(routeName: string): Promise<Array<Bus>>;
  // 버스 routeId를 사용하여 버스 세부 정보 검색
  // getBusInfo;
  // 버스 routeId를 사용하여 버스 경유 정류소 검색
  // getRouteList;
}
