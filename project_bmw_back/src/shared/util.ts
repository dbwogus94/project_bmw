import moment from 'moment-timezone';
moment.tz.setDefault('Asia/Seoul');

export function dateToString(format?: string | undefined, date?: Date | undefined): string {
  if (format && !date) {
    return moment().format(format);
  }
  if (!format && date) {
    return moment().format();
  }
  if (format && date) {
    return moment(date).format(format);
  }

  // 모두 없는 경우
  return moment().format('YYYY-MM-DD HH:mm:ss');
}

export function getDistrictName(districtCd: number, type: string) {
  switch (districtCd) {
    case 1:
      return '서울';
    case 2:
      return '경기';
    case 3:
      return '인천';
    default:
      throw Error(`[BusDto(${type})] ${districtCd}는 유효하지 않은 districtCd 입니다.`);
  }
}

export function getRouteTypeName(routeType: number) {
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
