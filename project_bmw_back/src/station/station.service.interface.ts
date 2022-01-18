import { StationDto } from './dto/response/station/station.dto';

export interface StationService {
  // 1. 정류소명과 일치하는 정류소 검색
  getStationListByStationName(stationName: string): Promise<StationDto[]>;
}
