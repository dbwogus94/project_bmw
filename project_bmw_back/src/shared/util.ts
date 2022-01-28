import moment from 'moment-timezone';
moment.tz.setDefault('Asia/Seoul');

export const DateUtil = {
  /**
   * 입력 받은 포멧에 해당하는 날짜 포멧의 문자열 생성
   * @param format 날짜 포멧(defualt: 'YYYY-MM-DD HH:mm:ss')
   * @param date 변경하고 싶은 Date 객체(defualt: to Day)
   * @returns
   */
  dateToString: (format?: string | undefined, date?: Date | undefined): string => {
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
  },
  /**
   * 오늘에 해당하는 요일을 숫자로 리턴
   * @returns 0: 일, 1: 월, 2: 화. 3: 수, 4: 목, 5: 금, 6: 토
   */
  getDayNum: (): number => {
    return moment().day();
  },
  /**
   * 한국 표준시간(KST)을 Date 타입으로 가져온다
   * @returns
   */
  getKorDate: (): Date => {
    // 1. 현재 시간(Locale)
    const curr = new Date();
    // 2. UTC 시간 계산
    const utc = curr.getTime() + curr.getTimezoneOffset() * 60 * 1000;
    // 3. UTC to KST (UTC + 9시간)
    const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
    return new Date(utc + KR_TIME_DIFF);
  },
};

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
