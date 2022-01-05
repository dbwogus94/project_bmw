import { Bus } from '@bus/dto/response/bus/bus.interface';
/**
 * 경기도 Open API 노선번호목록조회 결과 DTO
 *  - 서비스명: 버스노선조회(REST)
 *  - 오퍼레이션명(국문): 노선번호목록조회
 *  - 오퍼레이션명(영문): getBusRouteList
 */
export class GyeonggiBusDto implements Bus {
  // 버스ID(routeId)
  routeId: number;
  // 버스이름(routeName)
  routeName: string;
  // 노선유형코드(routeTypeCd)
  routeTypeCd: number;
  // 노선유형명(routeTypeName)
  routeTypeName: string;
  // 관할지역코드()districtCd
  districtCd: number;
  // 관할지역명(x)
  districtName: '서울' | '경기' | '인천';
  // 서울, 경기 구분 라벨
  type: 'seoul' | 'gyeonggi';

  constructor(gyeonggiBusData: any) {
    const { routeId, routeName, routeTypeCd, routeTypeName, districtCd } = gyeonggiBusData;
    this.routeId = routeId;
    this.routeName = routeName;
    this.routeTypeCd = routeTypeCd;
    this.routeTypeName = routeTypeName;
    this.districtCd = districtCd;
    this.districtName = this.getDistrictName(districtCd);
    this.type = 'gyeonggi';
  }

  getDistrictName(districtCd: number) {
    switch (districtCd) {
      case 1:
        return '서울';
      case 2:
        return '경기';
      case 3:
        return '인천';
      default:
        throw Error('[GyeonggiBusDto] 유효하지 않은 districtCd 입니다.');
    }
  }
}
