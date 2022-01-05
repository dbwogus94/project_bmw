import { EntityRepository, Repository } from 'typeorm';
import { BmGroup, IBmGroup } from '@bmGroup/entities/BmGroup.entity';

export interface IBmGroupRepository {
  findAll(userId: number | string): Promise<IBmGroup[]>;
  findOneById(userId: number | string, bmGroupId: number | string): Promise<IBmGroup | undefined>;
}

@EntityRepository(BmGroup)
export class BmGroupRepository extends Repository<BmGroup> implements IBmGroupRepository {
  /**
   * 로그인한 유저의 모든 BM 그룹 리턴
   * @param userId
   * @returns
   * - 조회 필드: ['bg.bmGroupId', 'bg.bmGroupName', 'user.id']
   */
  findAll(userId: number | string): Promise<IBmGroup[]> {
    return this.createQueryBuilder('bg')
      .select(['bg.bmGroupId', 'bg.bmGroupName', 'user.username'])
      .innerJoin('bg.user', 'user')
      .where('user.id = :userId', { userId })
      .orderBy('bg.bmGroupId', 'ASC')
      .getMany();
  }

  /**
   * 로그인한 유저Id + bmGroupId를 사용하여 BM 그룹 하나를 조회
   * @param userId
   * @param bmGroupId
   * @returns
   * - 조회 필드: ['bg.bmGroupId', 'bg.bmGroupName', 'user.id']
   */
  findOneById(userId: number | string, bmGroupId: string | number): Promise<IBmGroup | undefined> {
    return this.createQueryBuilder('bg')
      .select(['bg.bmGroupId', 'bg.bmGroupName', 'user.username'])
      .innerJoin('bg.user', 'user')
      .where('user.id = :userId', { userId })
      .andWhere('bg.bmGroupId = :bmGroupId', { bmGroupId })
      .getOne();
  }
}
