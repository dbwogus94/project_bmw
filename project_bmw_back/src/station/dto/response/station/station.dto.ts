import { getDistrictName } from '@src/shared/util';

export class StationDto {
  stationId: number;
  stationName: string;
  mobileNo: number; // 서울시는 여기에 정류소고유번호(arsId)를 넣는다.
  districtCd: number;
  districtName: '서울' | '경기' | '인천';
  regionName: string;
  type: 'seoul' | 'gyeonggi';
  label: 'S' = 'S';

  constructor(
    stationId: number,
    stationName: string,
    mobileNo: number,
    districtCd: number,
    regionName: string,
    type: 'seoul' | 'gyeonggi',
  ) {
    this.stationId = stationId;
    this.stationName = stationName;
    this.mobileNo = mobileNo;
    this.districtCd = districtCd;
    this.districtName = getDistrictName(districtCd, type);
    this.regionName = regionName;
    this.type = type;
  }
}
