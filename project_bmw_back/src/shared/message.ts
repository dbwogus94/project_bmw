export const httpName: any = Object.freeze({
  200: 'OK',
  201: 'CREATED',
  204: 'NO_CONTENT',
  400: 'BAD_REQUEST',
  401: 'UNAUTHORIZED',
  403: 'FORBIDDEN',
  404: 'NOT_FOUND',
  409: 'CONFLICT',
  500: 'INTERNAL_SERVER_ERROR',
});

/**
 * 에러 메세지 key는 호출된 컨트롤러를 기준으로 한다.
 */
export const errorMessages: any = Object.freeze({
  BAD_REQUEST_MESSAGE: {
    code: 400,
    validate: {
      isEmail: 'email 형식이 아닙니다.',
      isNotEmpty: '필수 값이 입력되지 않았습니다.',
      isString: '문자 형식이 아닙니다.',
      isNumber: '숫자 형식이 아닙니다.',
      matches: '정규식에 일치하지 않습니다.',
      maxLength: '최대 길이를 초과했습니다.',
    },
    validator: '요청에 필요한 필수 값이 없습니다.',
    /* bmGroup */
    getBmGroup: 'bmGroupId이 잘못되었습니다. ex) 로그인된 user의 bmGroup이 아닙니다.',
    /* bookMark */
    searchBookMark: 'bmGroupId이 잘못되었습니다. ex) 로그인된 user의 bmGroup이 아닙니다.',
    createBookMark: 'bmGroupId이 잘못되었습니다. ex) 로그인된 user의 bmGroup이 아닙니다.',
    deleteBookMark: 'bmGroupId이 잘못되었습니다. ex) 로그인된 user의 bmGroup이 아닙니다.',
  },
  UNAUTHORIZED_MESSAGE: {
    code: 401,
    /* auth */
    signin: '등록된 사용자가 아니거나, 정보가 일치하지 않습니다.',
    isAuth: '엑세스 토큰이 없거나, 만료되었습니다. 다시 로그인 하세요',
  },
  NOT_FOUND_MESSAGE: {
    code: 404,
    not_found: 'NOT_FOUND',
    /* auth */
    signout: '탈퇴한 유저가 입니다.',
    /* bus */
    getBusInfo: '버스 상세정보가 없습니다. routeId를 확인하세요.',
    getStations: '경유 정류장 목록이 없습니다. routeId를 확인하세요.',
    /* station */
    getSationBusList: '정류장을 정차하는 노선이 없습니다. stationId를 확인하세요.',
    /* bmGroup */
    deleteBmGroup: '요청한 bmGroupId에 해당하는 BM그룹이 없습니다.',
    /* bookMark */
    deleteBookMark: '요청한 bmGroupId에 해당하는 BM그룹에는 bookMarkId를 가진 북마크가 없습니다.',
  },
  CONFLICT_MESSAGE: {
    code: 409,
    signup: '중복된 username 입니다.',
    /* bookMark */
    createBookMark: '추가를 요청한 북마크가 존재합니다.',
  },
  INTERNAL_SERVER_ERROR_MESSAGE: {
    code: 500,
    serverError: 'INTERNAL_SERVER_ERROR',
    Gyeonggi_getArrivalInfo: '도착 정보 서비스 오류입니다. 잠시후 다시 시도하세요',
  },
});

const successMessages: any = Object.freeze({
  OK_MESSAGE: {
    code: 200,
    /* auth */
    me: '엑세스 토큰이 유효합니다.',
    /* bus */
    getBusList: '버스노선 검색에 성공했습니다.',
    getBusInfo: '노선 상세정보 조회에 성공했습니다.',
    getStations: '노선의 경유 정류소 조회에 성공했습니다.',
    getArrivalInfo: '노선의 도착정보 조회에 성공했습니다.',
    /* station */
    getStationList: '정류소 검색에 성공했습니다.',
    getStopBusList: '정류소에 정차하는 노선목록 조회에 성공했습니다.',
    /* bmGroup */
    getBmGroups: 'BM그룹 리스트 조회에 성공했습니다.',
    getBmGroup: 'BM그룹에 조회에 성공했습니다.',
    /* bookMark */
    searchBookMark: '북마크를 성공적으로 조회했습니다.',
  },
  CREATED_MESSAGE: {
    code: 201,
    /* auth */
    signin: '로그인 성공! 엑세스 토큰이 발급됐습니다.',
    refreshToken: '엑세스 토큰이 재발급됐습니다.',
    /* bmGroup */
    createBmGroup: 'BM그룹을 성공적으로 생성했습니다.',
    /* bookMark */
    createBookMark: '북마크를 성공적으로 생성했습니다.',
  },
  NO_CONTENT_MESSAGE: {
    code: 204,
    /* auth */
    signout: '로그아웃 처리되어 토큰을 만료합니다.',
    /* bmGroup */
    deleteBmGroup: '요청한 BM그룹을 성공적으로 삭재했습니다.',
    /* bookMark */
    deleteBookMark: '그룹에 매핑된 북마크를 성공적으로 삭제했습니다.',
  },
});

export function getHttpName(code: string | number): any {
  return httpName[code];
}

export function getHttpErrorMessage(code: string | number): any {
  return errorMessages[`${getHttpName(code)}_MESSAGE`];
}

export function getHttpSuccessMessages(code: string | number): any {
  return successMessages[`${getHttpName(code)}_MESSAGE`];
}
