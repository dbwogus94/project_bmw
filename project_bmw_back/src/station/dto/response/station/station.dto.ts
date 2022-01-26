import { getDistrictName } from '@src/shared/util';

export class StationDto {
  // 경기도: 정류소 고유모바일번호(mobileNo) / 서울시: 정류소 고유번호(arsId), 서울시 지하철: 외부 코드(stationFrCode)
  arsId: string;
  // 정류소ID
  stationId: number;
  // 정류소이름
  stationName: string;
  // 관할지역코드
  districtCd: number;
  // 관할지역명
  districtName: '서울' | '경기' | '인천';
  // 구분
  label: 'S' = 'S';
  // api 타입
  type: 'seoul' | 'gyeonggi' | 'data.seoul';

  constructor(
    stationId: number,
    stationName: string,
    arsId: string,
    districtCd: number,
    type: 'seoul' | 'gyeonggi' | 'data.seoul',
  ) {
    this.stationId = stationId;
    this.stationName = stationName;
    this.arsId = arsId;
    this.districtCd = districtCd;
    this.districtName = getDistrictName(districtCd, type);
    this.type = type;
  }
}
