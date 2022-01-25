import { getDistrictName } from '@src/shared/util';

export class StationDto {
  // 정류소ID
  stationId: number;
  // 정류소이름
  stationName: string;
  // 정류소고유번호
  arsId: string; // 경기도 api의 고유모바일번호(mobileNo)는 서울시 api의 고유번호(arsId)와 같다
  // 관할지역코드
  districtCd: number;
  // 관할지역명
  districtName: '서울' | '경기' | '인천';
  // api 타입
  type: 'seoul' | 'gyeonggi' | 'data.seoul';
  // 구분
  label: 'S' = 'S';

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
