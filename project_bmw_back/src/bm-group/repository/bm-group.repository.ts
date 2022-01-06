import { EntityRepository, Repository } from 'typeorm';
import { BmGroup, IBmGroup } from '@bmGroup/entities/BmGroup.entity';

export interface IBmGroupRepository {
  findAll(userId: number): Promise<any[]>;
  findAllEntityTree(userId: number, checkColumn: string): Promise<IBmGroup[]>;
  findOneById(userId: number, bmGroupId: number): Promise<IBmGroup | undefined>;
}

@EntityRepository(BmGroup)
export class BmGroupRepository extends Repository<BmGroup> implements IBmGroupRepository {
  /**
   * 로그인한 유저의 그룹 리스트가 가진 bookMark 리스트중 checkColumn와 일치하는 모든 bmGroup조회
   * @param userId
   * @param checkColumn - String(routeId) + String(stationSeq) + String(stationId)
   * @returns 
   * - 리턴되는 bmGroups
   ```
   bmGroups [
      bmGroup {
          bmGroupBookMarks: [
            bmGroupBookMark { 
              bookMark 
            }
          ]
      }
    ]
    ```
   */
  async findAllEntityTree(userId: string | number, checkColumn: string): Promise<IBmGroup[]> {
    return (
      this.createQueryBuilder('bg')
        .select(['bg.bmGroupId', 'bg.bmGroupName']) // 'user.username'
        // .addSelect(['bookMark.startStationName', 'bookMark.endStationName']) // 숨겨진 컬럼은 이처럼 명시적으로 선언해야 가져온다.
        .innerJoin('bg.user', 'user') // 결과 노출 x
        .innerJoinAndSelect('bg.bmGroupBookMarks', 'bgbm') // 결과 노출 o
        .innerJoinAndSelect('bgbm.bookMark', 'bm') // innerJoin, leftJoinAndSelect, innerJoinAndSelect
        .where('user.id = :userId', { userId })
        .andWhere('bm.checkColumn = :checkColumn', { checkColumn }) // 22900006775229000968
        .orderBy('bg.bmGroupId', 'ASC')
        .getMany()
    );
  }

  /**
   * 로그인한 유저의 모든 BM 그룹 리턴
   * @param userId
   * @returns
   * - 조회 필드: ['bg.bmGroupId', 'bg.bmGroupName', 'user.id']
   */
  async findAll(userId: number | string): Promise<IBmGroup[]> {
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
  async findOneById(userId: number | string, bmGroupId: string | number): Promise<IBmGroup | undefined> {
    return this.createQueryBuilder('bg')
      .select(['bg.bmGroupId', 'bg.bmGroupName', 'user.username'])
      .innerJoin('bg.user', 'user')
      .where('user.id = :userId', { userId })
      .andWhere('bg.bmGroupId = :bmGroupId', { bmGroupId })
      .getOne();
  }
}
