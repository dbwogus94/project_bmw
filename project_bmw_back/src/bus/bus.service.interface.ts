import { ArrivalDto } from './dto/response/arrival/arrival.dto';
import { BusDto } from './dto/response/bus/bus.dto';
import { BusInfoDto } from './dto/response/info/info.dto';
import { BusStationDto } from './dto/response/station/station.dto';

export interface BusService {
  // 1. 버스번호와 일치하는 버스 검색
  getBusListByRouteName(routeName: string): Promise<BusDto[]>;
  // 2. 버스 routeId를 사용하여 버스 세부 정보 검색
  getBusInfoByRouteId(routeId: number): Promise<BusInfoDto | null>;
  // 3. 버스 routeId를 사용하여 버스 경유 정류소 검색
  getStationsByRouteId(routeId: number): Promise<BusStationDto[]>;
  // 4. 버스 도착정보 검색
  getArrivalInfo(routeId: number, stationSeq: number, stationId: number): Promise<ArrivalDto>;
}
