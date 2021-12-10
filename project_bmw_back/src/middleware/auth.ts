import { NextFunction, Request, Response } from 'express';
import { config } from '@src/config';
import { IJwtPayload, JwtService } from '@src/shared/JwtService';
import { StatusCodes } from 'http-status-codes';
import { errorMessages } from '@src/shared/message';
import { getClient } from '@src/db/redis';

const { cookie, jwt } = config;
const { UNAUTHORIZED, MOVED_TEMPORARILY } = StatusCodes;
const { UNAUTHORIZED_MESSAGE } = errorMessages;

export const isAuth = async (req: Request, res: Response, next: NextFunction) => {
  const jwtService = new JwtService();
  const errMessage = {
    errCode: UNAUTHORIZED,
    message: UNAUTHORIZED_MESSAGE.isAuth,
  };

  // 1. 쿠키에서 jwt 가져오기
  const accessToken: string = req.signedCookies[cookie.key];
  if (!accessToken) {
    return res.status(UNAUTHORIZED).json(errMessage);
  }

  try {
    // 2. jwt 디코딩
    const payload: any = await jwtService.decodeToken(accessToken, jwt.access.secret);
    try {
      // 3. 유효한 토큰이면? 블랙 리스트 토큰 조회
      const { id, username } = payload;
      const blacklistToken = await getClient().get(username);

      // 4. 블랙 리스트이면? 401 응답
      if (blacklistToken && blacklistToken === accessToken) {
        res.status(UNAUTHORIZED).json(errMessage);
      }
      // 5. 블랙리스트에 없거나 아니라면? req에 디코딩 데이터 담고 통과
      req.id = id!;
      req.username = username!;
      next();
    } catch (error) {
      // redis 에러
      throw error;
    }
  } catch (error) {
    // 2. jwt 디코딩 실패 -> refresh 호출
    const { username } = req.query;
    return res.redirect(MOVED_TEMPORARILY, `/api/auth/refresh?username=${username}`);
  }
};
