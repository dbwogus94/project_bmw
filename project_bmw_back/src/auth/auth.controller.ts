import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { config } from '@config';
import { JwtService } from '@shared/jwt.service';
import { AuthService, IAuthService } from './auth.service';
import { UserDto } from '@user/dto/response/user.dto';

const { TEMPORARY_REDIRECT } = StatusCodes;
const { cookie } = config;
const { key, options } = cookie;
const jwtService = new JwtService();
const authService: IAuthService = new AuthService(jwtService, config);

/**
 * 쿠키로 사용할 값 생성
 * @param accessToken
 * @param username
 * @returns - accessToken + ' ' + username
 */
const createCookie = (accessToken: string, username: string) => {
  // accessToken + ' ' + username
  return `${accessToken} ${username}`;
};

// POST auth/signup
export const signup = async (req: Request, res: Response, next: NextFunction) => {
  await authService.signup(req.dto);
  // 307 POST => POST로 일시적 리다이렉트
  return res.redirect(TEMPORARY_REDIRECT, '/api/auth/signin');
};

// POST auth/signin
export const signin = async (req: Request, res: Response, next: NextFunction) => {
  const { accessToken, username }: UserDto = await authService.signin(req.dto);

  // 쿠키에 엑세스 토큰 저장
  res.cookie(key, createCookie(accessToken, username), {
    ...options,
    sameSite: options.sameSite === 'none' ? 'none' : false,
    // TODO: ts 컴파일 'No overload matches this call.' 에러로 인해 3항 연산자로 처리
    // sameSite은 "boolean | 'lax' | 'strict' | 'none' | undefined" 타입만 허용된다.
    // 여기서 문제는 options.sameSite의 타입이 'string'로 판별되기 때문에 에러가 발생한다.
  });

  req.responseData = {
    statusCode: 201,
    message: 'signin',
    data: { username },
  };
  return next();
};

// GET auth/me?username=:username
export const me = (req: Request, res: Response, next: NextFunction) => {
  const { username } = req;
  req.responseData = {
    statusCode: 200,
    message: 'me',
    data: { username },
  };
  return next();
};

// GET auth/refresh?username=:username
export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  // 1. 토큰 재발행
  const value: string = req.signedCookies[cookie.key];
  const { accessToken, username }: UserDto = await authService.reissueAccessToken(value);

  // 2. 응답 쿠키에 엑세스 토큰 저장 => 응답
  res.cookie(key, createCookie(accessToken, username), {
    ...options,
    sameSite: options.sameSite === 'none' ? 'none' : false,
  });

  req.responseData = {
    statusCode: 201,
    message: 'refreshToken',
    data: { username },
  };
  return next();
};

// GET auth/signout
export const signout = async (req: Request, res: Response, next: NextFunction) => {
  const cookieValue: string = req.signedCookies[key];

  // 1. 토큰 제거 + 토큰 블랙리스트 등록
  await authService.signout(cookieValue, req.id);

  // 2. 쿠키 제거
  res.clearCookie(key, {
    ...options,
    sameSite: options.sameSite === 'none' ? 'none' : false,
  });

  req.responseData = {
    statusCode: 204,
    message: 'signout',
  };
  return next();
};
