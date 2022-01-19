import { StationDto } from './station.dto';

export class GyeonggiStationDto extends StationDto {
  // 운행지역
  regionName: string;
  constructor(data: any) {
    const { stationId, stationName, mobileNo, districtCd, regionName } = data;
    super(stationId, stationName, mobileNo, districtCd, 'gyeonggi');
    this.regionName = regionName;
  }
}
