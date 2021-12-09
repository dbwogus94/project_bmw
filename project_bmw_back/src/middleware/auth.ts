import { NextFunction, Request, Response } from 'express';
import { config } from '@config';
import { IJwtPayload, JwtService } from '@shared/JwtService';
import { StatusCodes } from 'http-status-codes';
import { errorMessages } from '@shared/message';
import { getClient } from '@db/redis';

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

  // TODO: 코드 개선 예정
  // 2. jwt 디코딩
  jwtService
    .decodeJwt(accessToken, jwt.access.secret)
    .then((payload: IJwtPayload) => {
      const { id, username } = payload;

      // 3. 유효한 토큰이면? 블랙 리스트 토큰 조회
      getClient()
        .get(username)
        .then((blacklistToken: string | null) => {
          // 4. 블랙 리스트이면? 401 응답
          if (blacklistToken && blacklistToken === accessToken) {
            res.status(UNAUTHORIZED).json(errMessage);
          }
          // 4. 블랙리스트에 없거나 아니라면? req에 디코딩 데이터 담고 통과
          req.id = id!;
          req.username = username!;
          next();
        });
    })
    .catch(error => {
      // 2. jwt 디코딩 실패 -> refresh 호출
      const { username } = req.query;
      return res.redirect(MOVED_TEMPORARILY, `/api/auth/refresh?username=${username}`);
    });
};
