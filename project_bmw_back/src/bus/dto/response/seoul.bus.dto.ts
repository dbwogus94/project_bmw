import { Bus } from '@bus/dto/response/bus.dto.interface';

export class SeoulBusDto implements Bus {
  routeId: number;
  routeName: string;
  routeTypeCd: number;
  routeTypeName: string;
  districtCd: number;
  districtName: '서울' | '경기' | '인천';
  type: 'seoul' | 'gyeonggi';

  constructor(seoulBusData: any) {
    const { busRouteId, busRouteNm, routeType } = seoulBusData;
    this.routeId = busRouteId;
    this.routeName = busRouteNm;
    this.routeTypeCd = routeType;
    this.routeTypeName = this.getRouteTypeName(routeType);
    this.districtCd = 1;
    this.districtName = '서울';
    this.type = 'seoul';
  }

  // TODO: TS enum 값에 해당하는 enum을 가져오는 기능있으면 enum으로 변경 해야한다.
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
