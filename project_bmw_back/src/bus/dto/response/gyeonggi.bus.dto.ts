import { Bus, DistrictName } from '@bus/dto/response/bus.dto.interface';

export class GyeonggiBusDto implements Bus {
  routeId: string | number;
  routeName: string;
  routeTypeCd: number;
  routeTypeName: string;
  districtCd: number;
  districtName: DistrictName;
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
        return DistrictName.서울;
      case 2:
        return DistrictName.경기;
      case 3:
        return DistrictName.인천;
      default:
        throw Error('[GyeonggiBusDto] 유효하지 않은 districtCd 입니다.');
    }
  }
}