import { IUser, User } from '@user/entities/User.entity';
import { EntityRepository, Repository } from 'typeorm';

export interface IUserRepository {
  findByUsername(username: string): Promise<IUser | undefined>;
  findByUserId(id: number | string): Promise<IUser | undefined>;
}

@EntityRepository(User)
export class UserRepository extends Repository<User> implements IUserRepository {
  /**
   * 로그인 id를 사용하여 유저 테이블의 모든 정보를 조회(주의!)
   * @param username
   * @returns
   */
  async findByUsername(username: string): Promise<IUser | undefined> {
    return this.findOne({ username });
  }

  /**
   * id(pk)를 사용하여 유저의 일부 정보만 조회
   * @param id
   * @returns
   * - 조회 필드: 'id', 'username', 'name', 'email'
   */
  async findByUserId(id: string | number): Promise<IUser | undefined> {
    return this.findOne(id, { select: ['id', 'username', 'name', 'email'] });
  }
}
