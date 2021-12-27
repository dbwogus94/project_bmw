import { Bus } from '@bus/dto/response/bus/bus.interface';
import { Info } from '@bus/dto/response/info/info.interface';
import { Station } from '@bus/dto/response/station/station.interface';

export interface BusService {
  // 1. 버스번호와 일치하는 버스 검색
  getBusListByRouteName(routeName: string): Promise<Bus[]>;
  // 2. 버스 routeId를 사용하여 버스 세부 정보 검색
  getBusInfoByRouteId(routeId: number): Promise<Info | null>;
  // 3. 버스 routeId를 사용하여 버스 경유 정류소 검색
  getStationsByRouteId(routeId: number): Promise<Station[]>;
}
