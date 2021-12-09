export const errorMessages: any = Object.freeze({
  BAD_REQUEST_MESSAGE: {
    code: 400,
    isEmail: 'email 형식이 아닙니다.',
    isNotEmpty: '필수 값이 입력되지 않았습니다.',
    isString: '문자 형식이 아닙니다.',
  },
  CONFLICT_MESSAGE: {
    code: 409,
    signup: '중복된 username 입니다.',
  },
  UNAUTHORIZED_MESSAGE: {
    code: 401,
    signin: '등록된 사용자가 아니거나, 정보가 일치하지 않습니다.',
    isAuth: '엑세스 토큰이 없거나, 만료되었습니다. 다시 로그인 하세요',
  },
  INTERNAL_SERVER_ERROR_MESSAGE: {
    code: 500,
    serverError: 'INTERNAL_SERVER_ERROR',
  },
  NOT_FOUND_MESSAGE: {
    code: 404,
    signout: '탈퇴한 유저가 입니다.',
  },
});
