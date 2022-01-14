import { BmGroupRepository } from '@bmGroup/repository/bm-group.repository';
import { getClient } from '@db/redis';
import { HttpError } from '@shared/http.error';
import { JwtService } from '@shared/jwt.service';
import { SigninDto } from '@user/dto/request/signin.dto';
import { SignupDto } from '@user/dto/request/signup.dto';
import { UserDto } from '@user/dto/response/user.dto';
import { IUser } from '@user/entities/User.entity';
import { UserRepository } from '@user/repository/user.repositroy';
import bcrypt from 'bcrypt';
import { getConnection, getCustomRepository } from 'typeorm';

export interface IAuthService {
  jwtService: JwtService;
  config: any;
  signup(dto: SignupDto): Promise<void>;
  signin(dto: SigninDto): Promise<UserDto>;
  reissueAccessToken(cookieValue: string): Promise<UserDto>;
  signout(cookieValue: string, userId: number): Promise<void>;
}

export class AuthService implements IAuthService {
  jwtService: JwtService;
  config: any;
  private accessConfig: any;
  private refreshConfig: any;

  constructor(jwtService: JwtService, config: any) {
    const { jwt } = config;
    const { access, refresh } = jwt;
    this.accessConfig = access;
    this.refreshConfig = refresh;
    //
    this.jwtService = jwtService;
    this.config = config;
  }

  /**
   * 유저 회원가입
   * - 유저 생성
   * - 디폴트 그룹 생성
   * @param dto
   */
  async signup(dto: SignupDto): Promise<void> {
    const userRepository: UserRepository = getCustomRepository(UserRepository);
    const bmGroupRepository: BmGroupRepository = getCustomRepository(BmGroupRepository);
    const { username, password, name, email } = dto;

    // username 중복확인
    const isExist: boolean = !!(await userRepository.findByUsername(username));
    if (isExist) {
      throw new HttpError(409, 'signup');
    }
    // 패스워드 암호화
    const hashPassword: string = await bcrypt.hash(password, this.config.bcrypt.salt);

    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    await queryRunner.commitTransaction();
    let user: IUser;
    try {
      // 유저 생성
      user = userRepository.create({
        username,
        hashPassword,
        name,
        email,
      });
      await userRepository.save(user);
      // 디폴트 그룹 생성
      const bmGroup = bmGroupRepository.create({
        user,
        bmGroupName: '기본 북마크',
      });
      await bmGroupRepository.save(bmGroup);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 유저 로그인
   * - 엑세스 토큰, 리프레쉬 토큰 발급
   * @param dto
   * @returns
   */
  async signin(dto: SigninDto): Promise<UserDto> {
    const userRepository: UserRepository = getCustomRepository(UserRepository);
    const { username, password }: SigninDto = dto;

    // 가입된 회원인지 확인
    const user: IUser | undefined = await userRepository.findByUsername(username);
    if (!user) {
      throw new HttpError(401, 'signin');
    }
    const { id, hashPassword } = user;

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
      accessToken: await this.jwtService.issueToken({ id, username }, { ...this.accessConfig }),
      refreshToken: await this.jwtService.issueToken({}, { ...this.refreshConfig }),
    });

    return new UserDto({ accessToken: newUser.accessToken, username });
  }

  /**
   * 엑세스 쿠키 재발행
   * 1. 인자로 받은 cookie, 토큰 확인
   * 2. 유저 조회 및 엑세스 토큰 비교
   * 3. 리프래시 토큰 유효한지 확인
   * 4. 엑세스 토큰 재발급, db 저장
   * @param cookieValue - accessToken + ' ' + username
   * @returns
   */
  async reissueAccessToken(cookieValue: string): Promise<UserDto> {
    // 1. 인자로 받은 cookie, 토큰 확인
    const [accessToken, username] = cookieValue ? cookieValue.split(' ') : [];
    if (!cookieValue || !accessToken || !username) {
      throw new HttpError(401, 'isAuth');
    }

    // 2. 유저 조회 및 엑세스 토큰 비교
    const userRepository: UserRepository = getCustomRepository(UserRepository);
    const user = await userRepository.findByUsername(username);
    if (!user || user.accessToken !== accessToken) {
      throw new HttpError(401, 'isAuth');
    }

    // 3. 리프래시 토큰 유효한지 확인
    const { id, refreshToken } = user;
    const isActive = await this.jwtService.decodeToken(refreshToken!, this.refreshConfig.secret);
    if (!isActive) {
      throw new HttpError(401, 'isAuth');
    }

    // 4. 엑세스 토큰 재발급, db 저장
    const newUser = await userRepository.save({
      ...user,
      accessToken: await this.jwtService.issueToken({ id, username }, { ...this.accessConfig }),
    });

    return new UserDto({ accessToken: newUser.accessToken, username });
  }

  /**
   * 유저 로그아웃 처리
   * 1. 인자로 받은 cookie, 토큰 확인
   * 2. user 테이블에서 토큰 모두 제거
   * 3. usename key로 redis 블랙리스트 등록
   * @param cookieValue - accessToken + ' ' + username
   * @param userId
   */
  async signout(cookieValue: string, userId: number): Promise<void> {
    // 1. 인자로 받은 cookie, 토큰 확인
    const [accessToken, username] = cookieValue ? cookieValue.split(' ') : [];
    if (!cookieValue || !accessToken || !username) {
      throw new HttpError(401, 'isAuth');
    }

    // 2. user 테이블에서 토큰 모두 제거
    const userRepository: UserRepository = getCustomRepository(UserRepository);
    const result = await userRepository.update({ id: userId }, { accessToken: '', refreshToken: '' });
    if (result.affected === 0) {
      // 유저 없음
      throw new HttpError(404, 'signout');
    }

    // 3. usename key로 redis 블랙리스트 등록
    await getClient().set(username, accessToken);
  }
}
