import { StationDto } from './station.dto';

export class GyeonggiStationDto extends StationDto {
  constructor(data: any) {
    const { stationId, stationName, mobileNo, districtCd, regionName } = data;
    super(stationId, stationName, mobileNo, districtCd, regionName, 'gyeonggi');
  }
}
