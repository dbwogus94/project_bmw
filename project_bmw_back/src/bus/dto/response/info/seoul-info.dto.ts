import { Info } from './info.interface';

/**
 * 서울시 Open API 버스노선 상세정보 조회 결과 DTO
 * - 서비스명: 노선정보조회 서비스
 * - 오퍼레이션명(국문): 노선기본정보항목조회
 * - 오퍼레이션명(영문): getRouteInfoItem
 */
export class SeoulBusInfoDto implements Info {
  // 노선ID(busRouteId)
  routeId: number;
  // 노선번호(busRouteNm)
  routeName: string;
  // 기점정류소명(stStationNm)
  startStationName: string;
  // 종점정류소명(edStationNm)
  endStationName: string;
  // 노선유형코드(routeType)
  routeTypeCd: number;
  // 노선유형명(x)
  routeTypeName: string;
  // 노선운행지역명(x)
  regionName: string;
  // 관할지역코드(x)
  districtCd: number;
  // 관할지역명(x)
  districtName: '서울' | '경기' | '인천';
  // 최소배차시간(term)
  minTerm: number;
  // 최대배차시간(term)
  maxTerm: number;
  // 운수업체ID(x)
  companyId: number;
  // 운수업체명(corpNm)
  companyName: Number;
  // 운수업체명(corpNm)
  companyTel: string;
  // 구분 타입
  type: 'seoul' | 'gyeonggi';
  // 버스(B), 지하철(M) 구분
  label: 'B';

  /* 서울시만 있는 데이터 */
  // 첫차시간
  firstBusTm: string;
  // 막차시간
  lastBusTm: string;
  // 저상 첫차시간
  firstLowTm: string;
  // 저상 막차시간
  lastLowTm: string;

  constructor(seoulBusInfoData: any) {
    const {
      busRouteId,
      busRouteNm,
      stStationNm,
      edStationNm,
      routeType,
      term,
      corpNm,
      firstBusTm,
      lastBusTm,
      firstLowTm,
      lastLowTm,
    } = seoulBusInfoData;

    const [companyName, companyTel] = corpNm.split(' ');

    this.routeId = busRouteId;
    this.routeName = busRouteNm;
    this.startStationName = stStationNm;
    this.endStationName = edStationNm;
    this.routeTypeCd = routeType;
    this.routeTypeName = this.getRouteTypeName(routeType);
    this.regionName = '서울';
    this.districtCd = 1;
    this.districtName = '서울';
    this.minTerm = term;
    this.maxTerm = term;
    // 운수업체
    this.companyId = 0; // 서울은 운수업체 id를 제공하지 않음
    this.companyName = companyName;
    this.companyTel = companyTel ? companyTel : '';
    this.type = 'seoul';
    this.label = 'B';
    // 막차 첫차
    this.firstBusTm = firstBusTm;
    this.lastBusTm = lastBusTm;
    this.firstLowTm = firstLowTm;
    this.lastLowTm = lastLowTm;
  }

  // TODO: 공통으로 이동 예정
  getRouteTypeName(routeType: number) {
    switch (routeType) {
      case 1:
        return '공항버스';
      case 2:
        return '마을버스';
      case 3:
        return '간선버스';
      case 4:
        return '지선버스';
      case 5:
        return '순환버스';
      case 6:
        return '광역버스';
      case 7:
        return '인천버스';
      case 8:
        return '경기버스';
      case 9:
        return '폐지';
      case 0:
        return '공용버스';
      case 10:
        return '노랑풍선시티버스';
      default:
        throw Error('[SeoulBusDto] 유효하지 않은 routeType 입니다.');
    }
  }
}
