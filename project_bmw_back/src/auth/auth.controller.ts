import { NextFunction, Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { StatusCodes } from 'http-status-codes';
import bcrypt from 'bcrypt';
import { UserRepository } from '@user/repository/user.repositroy';
import { config } from '@config';
import { SignupDto } from '@user/dto/signup.dto';
import { IUser } from '@user/entities/User.entity';
import { SigninDto } from '@user/dto/signin.dto';
import { errorMessages } from '@shared/message';
import { JwtService } from '@shared/jwt.service';
import { getClient } from '@db/redis';
import { HttpError } from '@shared/http.error';

const { TEMPORARY_REDIRECT } = StatusCodes;
const { cookie, jwt } = config;
const { access, refresh } = jwt;
const { key, options } = cookie;
const jwtService = new JwtService();

// POST auth/signup
export const signup = async (req: Request, res: Response, next: NextFunction) => {
  const { username, password, name, email }: SignupDto = req.dto;
  const userRepository: UserRepository = getCustomRepository(UserRepository);

  try {
    // 아이디 중복 확인
    const isExist: boolean = !!(await userRepository.findByUsername(username));
    if (isExist) {
      throw new HttpError(409, 'signup');
    }

    // 패스워드 암호화
    const hashPassword: string = await bcrypt.hash(password, config.bcrypt.salt);

    // 저장
    const user: IUser = userRepository.create({
      username,
      hashPassword,
      name,
      email,
    });
    await userRepository.save(user);

    // 307 POST => POST로 일시적 리다이렉트
    return res.redirect(TEMPORARY_REDIRECT, '/api/auth/signin');
  } catch (error) {
    throw error;
  }
};

// POST auth/signin
export const signin = async (req: Request, res: Response, next: NextFunction) => {
  const { username, password }: SigninDto = req.dto;
  const userRepository: UserRepository = getCustomRepository(UserRepository);

  try {
    // 가입된 회원인지 확인
    const user: IUser | undefined = await userRepository.findByUsername(username);
    if (!user) {
      throw new HttpError(401, 'signin');
    }
    const { id, hashPassword, accessToken } = user;

    // 패스워드 확인
    const result: boolean = await bcrypt.compare(password, hashPassword);
    if (!result) {
      throw new HttpError(401, 'signin');
    }

    // TODO: DB에서 토큰 확인 이미 발급된 토큰 있으면?
    // 로그아웃 되지 않은 유저 다른곳에서 로그인 하는것
    // =>  엑세스는 그대로 두고 리프레시만 재발급

    // 엑세스, 리프래시 발급 => 토큰 DB저장
    const newUser = await userRepository.save({
      ...user,
      accessToken: await jwtService.issueToken({ id, username }, { ...access }),
      refreshToken: await jwtService.issueToken({}, { ...refresh }),
    });

    // 쿠키에 엑세스 토큰 저장
    res.cookie(key, newUser.accessToken, {
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
    next();
  } catch (error) {
    throw error;
  }
};

// GET auth/me?username=:username
export const me = (req: Request, res: Response, next: NextFunction) => {
  const { username } = req;
  req.responseData = {
    statusCode: 200,
    message: 'me',
    data: { username },
  };
  next();
};

// GET auth/refresh?username=:username
export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  const { username } = req.dto;

  // 1. 토큰 확인
  const accessToken: string = req.signedCookies[key];
  if (!accessToken) {
    throw new HttpError(401, 'isAuth');
  }

  // 2. 유저 조회 및 엑세스 토큰 비교
  const userRepository: UserRepository = getCustomRepository(UserRepository);
  try {
    const user = await userRepository.findByUsername(username);
    if (!user || user.accessToken !== accessToken) {
      throw new HttpError(401, 'isAuth');
    }

    // 3. 리프래시 토큰 유효한지 확인
    // TODO: 버그 !! decodeJwt에서 실패시 에러를 던지는 것이 아닌 false를 리턴하도록 수정해야함
    const { id, refreshToken } = user;
    const isActive = await jwtService.decodeToken(refreshToken!, refresh.secret);
    if (!isActive) {
      throw new HttpError(401, 'isAuth');
    }

    // 4. 엑세스 토큰 재발급, db 저장
    const newUser = await userRepository.save({
      ...user,
      accessToken: await jwtService.issueToken({ id, username }, { ...access }),
    });

    // 5. 응답 쿠키에 엑세스 토큰 저장 => 응답
    res.cookie(key, newUser.accessToken, {
      ...options,
      sameSite: options.sameSite === 'none' ? 'none' : false,
    });

    req.responseData = {
      statusCode: 201,
      message: 'refreshToken',
      data: { username },
    };
    next();
  } catch (error) {
    throw error;
  }
};

// GET auth/signout
export const signout = async (req: Request, res: Response, next: NextFunction) => {
  // 1. 쿠키에서 토큰 꺼낸 후 제거
  const accessToken: string = req.signedCookies[key];
  res.clearCookie(key, {
    ...options,
    sameSite: options.sameSite === 'none' ? 'none' : false,
  });

  const userRepository: UserRepository = getCustomRepository(UserRepository);
  try {
    // 2. db에서 토큰 모두 제거
    const result = await userRepository.update({ id: req.id }, { accessToken: '', refreshToken: '' });
    if (result.affected === 0) {
      throw new HttpError(404, 'signout');
    }
    // 3. usename key로 redis 블랙리스트 등록
    await getClient().set(req.username, accessToken);
    // return res.sendStatus(NO_CONTENT);

    req.responseData = {
      statusCode: 204,
      message: 'signout',
    };
    next();
  } catch (error) {
    throw error;
  }
};
