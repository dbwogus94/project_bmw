import { NextFunction, Request, Response } from 'express';
import { config } from '@config';
import { JwtService } from '@shared/jwt.service';
import { StatusCodes } from 'http-status-codes';
import { getClient } from '@db/redis';
import { HttpError } from '@shared/http.error';

const { cookie, jwt } = config;
const { MOVED_TEMPORARILY } = StatusCodes;

/**
 * ### isAuth 미들웨어
 * 1. 시크릿 쿠키 확인과, 쿠키에 엑세스 토큰과 로그인Id가 있는지 확인.
 *    (cookie = accessToken + ' ' + username)
 * 2. accessToken 디코딩하여 유효성 확인
 *    - accessToken 유효하지 않으면 => auth/refresh로 redirect
 * 3. accessToken 유효하면 블랙리스트 토큰인지 확인
 *    - 블랙리스트 토큰이라면 401 응답
 * 4. 블랙리스트가 아니라면 디코딩된 정보를 express Request에 담아 next()호출
 * @param req
 * @param res
 * @param next
 * @returns
 */
export const isAuth = async (req: Request, res: Response, next: NextFunction) => {
  const jwtService = new JwtService();

  // 1. 쿠키에서 jwt 가져오기
  const value: string = req.signedCookies[cookie.key];
  const [accessToken, username] = value.split(' ');
  if (!value || !accessToken || !username) {
    throw new HttpError(401, 'isAuth');
  }

  // 2. jwt 디코딩
  const payload: any = await jwtService.decodeToken(accessToken, jwt.access.secret);
  if (!payload) {
    // 2-1. jwt 디코딩 실패 -> refresh 호출
    return res.redirect(MOVED_TEMPORARILY, `/api/auth/refresh?username=${username}`);
  }

  try {
    // 3. 유효한 토큰이면? 블랙 리스트 토큰 조회
    const { id, username } = payload;
    const blacklistToken = await getClient().get(username);

    // 4. 블랙 리스트이면? 401 응답
    if (blacklistToken && blacklistToken === accessToken) {
      throw new HttpError(401, 'isAuth');
    }
    // 5. 블랙리스트에 없거나 아니라면? req에 디코딩 데이터 담고 통과
    req.id = id!;
    req.username = username!;
    return next();
  } catch (error: any) {
    error.message = '[redis] ' + error.message;
    return next(error);
  }
};
