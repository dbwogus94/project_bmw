import { BusDto } from '@src/bus/dto/response/bus/bus.dto';
import { StationDto } from './dto/response/station/station.dto';

export interface StationService {
  // 1. 정류소명과 일치하는 정류소 검색
  getStationListByStationName(stationName: string): Promise<StationDto[]>;
  // 2. 정류소에 정차하는 버스목록 조회
  getStopBusListByStationId(stationId: number | string): Promise<BusDto[]>;
}
