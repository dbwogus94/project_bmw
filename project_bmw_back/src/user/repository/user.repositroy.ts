import { IUser, User } from '@src/user/entities/User.entity';
import { EntityRepository, Repository } from 'typeorm';

export interface IUserRepository {
  findByUsername: (username: string) => Promise<IUser | undefined>;
}

@EntityRepository(User)
export class UserRepository extends Repository<User> implements IUserRepository {
  async findByUsername(username: string): Promise<IUser | undefined> {
    return this.findOne({ username });
  }
}
