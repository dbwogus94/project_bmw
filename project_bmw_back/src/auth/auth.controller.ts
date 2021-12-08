import { NextFunction, Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { StatusCodes } from 'http-status-codes';
import bcrypt from 'bcrypt';
import { UserRepository } from '@user/repository/user.repositroy';
import { config } from '@config';
import { SignupDto } from '@user/dto/signup.dto';
import { IUser } from '@user/entities/User.entity';
import { SigninDto } from '@user/dto/signin.dto';
import { errorMessage } from '@shared/message';
import { JwtService } from '@shared/JwtService';

const { CONFLICT_MESSAGE, UNAUTHORIZED_MESSAGE } = errorMessage;
const { UNAUTHORIZED, CONFLICT, OK, CREATED, PERMANENT_REDIRECT } = StatusCodes;
const { access, refresh } = config.jwt;
const jwtService = new JwtService();

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  const { username, password, name, email }: SignupDto = req.dto;
  const userRepository: UserRepository = getCustomRepository(UserRepository);

  // 아이디 중복 확인
  const isExist: boolean = !!(await userRepository.findByUsername(username));
  if (isExist) {
    return res.status(CONFLICT).json({
      errCode: CONFLICT_MESSAGE.code,
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
  // 로그인 로직으로...

  return res.redirect(PERMANENT_REDIRECT, '/api/auth/signin');
};

export const signin = async (req: Request, res: Response, next: NextFunction) => {
  const { username, password }: SigninDto = req.dto;
  const userRepository: UserRepository = getCustomRepository(UserRepository);
  const errMessage = {
    errCode: UNAUTHORIZED_MESSAGE.code,
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
    await userRepository.save({
      ...user,
      accessToken: await jwtService.issueToken({ id, username }, { ...access }),
      refreshToken: await jwtService.issueToken({ id, username }, { ...refresh }),
    });

    // 쿠키에 엑세스 토큰 저장
    const { key, options } = config.cookie;
    res.cookie(key, accessToken, options);

    return res.status(CREATED).json({
      id,
      username,
    });
  } catch (error) {
    throw error;
  }
};
