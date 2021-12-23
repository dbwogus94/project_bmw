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

const { UNAUTHORIZED, CONFLICT, OK, CREATED, TEMPORARY_REDIRECT, NO_CONTENT, NOT_FOUND } = StatusCodes;
const { CONFLICT_MESSAGE, UNAUTHORIZED_MESSAGE, NOT_FOUND_MESSAGE } = errorMessages;
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
      return res.status(CONFLICT).json({
        errCode: CONFLICT,
        message: CONFLICT_MESSAGE.signup,
      });
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
  const errMessage = {
    errCode: UNAUTHORIZED,
    message: UNAUTHORIZED_MESSAGE.signin,
  };

  try {
    // 가입된 회원인지 확인
    const user: IUser | undefined = await userRepository.findByUsername(username);
    if (!user) {
      return res.status(UNAUTHORIZED).json(errMessage);
    }
    const { id, hashPassword, accessToken } = user;

    // 패스워드 확인
    const result: boolean = await bcrypt.compare(password, hashPassword);
    if (!result) {
      return res.status(UNAUTHORIZED).json(errMessage);
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

    return res.status(CREATED).json({
      username,
    });
  } catch (error) {
    throw error;
  }
};

// GET auth/me?username=:username
export const me = (req: Request, res: Response, next: NextFunction) => {
  return res.status(OK).json({
    username: req.username,
  });
};

// GET auth/refresh?username=:username
export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  const { username } = req.dto;
  const errMessage = {
    errCode: UNAUTHORIZED,
    message: UNAUTHORIZED_MESSAGE.isAuth,
  };
  // 1. 토큰 확인
  const accessToken: string = req.signedCookies[key];
  if (!accessToken) {
    return res.status(UNAUTHORIZED).json(errMessage);
  }

  // 2. 유저 조회 및 엑세스 토큰 비교
  const userRepository: UserRepository = getCustomRepository(UserRepository);
  try {
    const user = await userRepository.findByUsername(username);
    if (!user || user.accessToken !== accessToken) {
      return res.status(UNAUTHORIZED).json(errMessage);
    }

    // 3. 리프래시 토큰 유효한지 확인
    // TODO: 버그 !! decodeJwt에서 실패시 에러를 던지는 것이 아닌 false를 리턴하도록 수정해야함
    const { id, refreshToken } = user;
    const isActive = await jwtService.decodeToken(refreshToken!, refresh.secret);
    if (!isActive) {
      return res.status(UNAUTHORIZED).json(errMessage);
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
    return res.status(CREATED).json({
      username,
    });
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
      return res.status(NOT_FOUND).json({
        code: NOT_FOUND,
        message: NOT_FOUND_MESSAGE,
      });
    }
    // 3. usename key로 redis 블랙리스트 등록
    await getClient().set(req.username, accessToken);
    return res.sendStatus(NO_CONTENT);
  } catch (error) {
    throw error;
  }
};
