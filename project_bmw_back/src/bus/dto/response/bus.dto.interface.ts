export interface Bus {
  // 버스 ID(숫자 일련번호)
  routeId: string | number;
  // 버스 이름(노선 번호)
  routeName: string;
  // 노선 유형 코드
  routeTypeCd: number;
  // 노선 유형 이름
  routeTypeName: string;
  // 관할 지역 코드
  districtCd: number;
  // 관할 지역 이름
  districtName: '서울' | '경기' | '인천';
  // 서울, 경기 구분 라벨
  type: 'seoul' | 'gyeonggi';
}
