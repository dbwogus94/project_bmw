import { getRouteTypeName } from '@src/shared/util';
import { BusInfoDto } from './info.dto';

/**
 * 서울시 Open API 버스노선 상세정보 조회 결과 DTO
 * - 서비스명: 노선정보조회 서비스
 * - 오퍼레이션명(국문): 노선기본정보항목조회
 * - 오퍼레이션명(영문): getRouteInfoItem
 */
export class SeoulBusInfoDto extends BusInfoDto {
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

    super(
      busRouteId, // 노선Id
      busRouteNm, // 노선이름
      stStationNm, // 기점 정류소 이름
      edStationNm, // 종점 정류소 이름
      routeType, // 노선유형코드
      getRouteTypeName(routeType), // 노선유형명
      '서울', // 노선운행지역명(서울은 제공하지 않음)
      1, // 관할지역코드
      term, // 최소배차시간
      term, // 최대배차시간
      0, // 회사코드(서울은 제공하지 않음)
      companyName, // 회사명
      companyTel ? companyTel : '', // 회사 전화번호
      'seoul', // api type
    );

    // 막차 첫차
    this.firstBusTm = firstBusTm;
    this.lastBusTm = lastBusTm;
    this.firstLowTm = firstLowTm;
    this.lastLowTm = lastLowTm;
  }
}
