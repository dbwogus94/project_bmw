import { DeleteResult, EntityRepository, Repository } from 'typeorm';
import { BmGroup, IBmGroup } from '@bmGroup/entities/BmGroup.entity';

export interface IBmGroupRepository {
  gatBmGroupsWithEntityTree(userId: number): Promise<IBmGroup[]>;
  searchBmGroupsWithEntityRowData(userId: number, checkColumn: string): Promise<any[]>;
  findById(userId: number): Promise<IBmGroup[]>;
  findOneById(userId: number, bmGroupId: number): Promise<IBmGroup | undefined>;
  findOneByIdWithEntityTree(userId: number, bmGroupId: number): Promise<IBmGroup | undefined>;
  deleteOne(userId: number, bmGroupId: number): Promise<DeleteResult | undefined>;
}

@EntityRepository(BmGroup)
export class BmGroupRepository extends Repository<BmGroup> implements IBmGroupRepository {
  /**
   * 로그인한 유저의 BmGroups 리턴
   * - User를 제외한 Entity Tree를 모두 포함하여 조회
   * @param userId
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
  async gatBmGroupsWithEntityTree(userId: number | string): Promise<IBmGroup[]> {
    return (
      this.createQueryBuilder('bg')
        .select(['bg.bmGroupId', 'bg.bmGroupName']) // 'user.username'
        // .addSelect(['bookMark.startStationName', 'bookMark.endStationName']) // 숨겨진 컬럼은 이처럼 명시적으로 선언해야 가져온다.
        .innerJoin('bg.user', 'user') // 결과 노출 x
        .leftJoinAndSelect('bg.bmGroupBookMarks', 'bgbm') // 결과 노출 o
        .leftJoinAndSelect('bgbm.bookMark', 'bm') // innerJoin, leftJoinAndSelect, innerJoinAndSelect
        .where('user.id = :userId', { userId })
        .orderBy('bg.bmGroupId', 'ASC')
        .getMany()
    );
  }

  /**
   * 로그인한 유저의 그룹 리스트가 가진 bookMark 리스트와 checkColumn와 일치하는 모든 bmGroup조회
   * @param userId
   * @param checkColumn - String(routeId) + String(stationSeq) + String(stationId)
   * @returns
   * - RowData
   */
  async searchBmGroupsWithEntityRowData(userId: string | number, checkColumn: string): Promise<any[]> {
    /* TODO: 원래는 bg테이블에 A를 inner join하면 안된다.
      - 적용하려 했던 쿼리는 SubQuery A에 SubQuery B Left join하는 것이다.
      - 하지만 typeOrm에서는 Entity를 사용하지 않고 바로 SubQuery를 사용하는 방법을 지원하지 않는다.
      - 결과적으로 bg에 SubQuery A를 join하고 이후 SubQuery B Left join하는 방법을 사용해야했다.
      **요점: typeOrm에 특성 때문에 한번의 join이 더 발생하게 됨.
      */

    return (
      this.createQueryBuilder('bg')
        .select('A.bmGroupId', 'bmGroupId')
        .addSelect('A.bmGroupName', 'bmGroupName')
        // .addSelect('B.*') // 자동으로 호출
        .innerJoin(
          subQuery => {
            // 1. 로그인 유저의 그룹 리스트 조회한다.
            return subQuery
              .select('bg.bmGroupId', 'bmGroupId')
              .addSelect('bg.bmGroupName', 'bmGroupName')
              .from(BmGroup, 'bg')
              .innerJoin('bg.user', 'user')
              .where('user.id = :userId', { userId })
              .groupBy('bg.bmGroupId');
          },
          'A',
          'A.bmGroupId = bg.bmGroupId',
        )
        .leftJoinAndSelect(
          subQuery => {
            // 2. checkColumn로 북마크를 조회하고 그 북마크를 가진 그룹을 조회한다.
            return subQuery
              .select('bg.bmGroupId', 'bmGroupId')
              .addSelect('bgbm.bmGroupBookMarkId', 'bmGroupBookMarkId')
              .addSelect('bm.bookMarkId', 'bookMarkId')
              .addSelect('bm.checkColumn', 'checkColumn')
              .addSelect('bm.routeId', 'routeId')
              .addSelect('bm.stationSeq', 'stationSeq')
              .addSelect('bm.stationId', 'stationId')
              .addSelect('bm.label', 'label')
              .addSelect('bm.routeName', 'routeName')
              .addSelect('bm.stationName', 'stationName')
              .addSelect('bm.direction', 'direction')
              .addSelect('bm.type', 'type')
              .addSelect('bm.createdAt', 'createdAt')
              .addSelect('bm.updatedAt', 'updatedAt')
              .from(BmGroup, 'bg')
              .innerJoin('bg.user', 'user')
              .innerJoin('bg.bmGroupBookMarks', 'bgbm')
              .innerJoin('bgbm.bookMark', 'bm')
              .where('user.id = :userId', { userId })
              .andWhere('bm.checkColumn = :checkColumn', { checkColumn });
          },
          'B',
          'A.bmGroupId = B.bmGroupId',
        )
        .orderBy('A.bmGroupId', 'ASC')
        .getRawMany()
    ); // 서브쿼리 사용하면 getMany() 정상 사용불가
  }

  /**
   * 로그인한 유저의 그룹 리스트를 조회 (연관관계 Entity 포함 x)
   * @param userId
   * @returns
   */
  async findById(userId: number): Promise<IBmGroup[]> {
    return this.createQueryBuilder('bg')
      .select(['bg.bmGroupId', 'bg.bmGroupName'])
      .innerJoin('bg.user', 'user')
      .where('user.id = :userId', { userId })
      .getMany();
  }

  /**
   * 로그인한 유저Id + bmGroupId를 사용하여 BM 그룹을 조회(연관 Entity 포함 o)
   * @param userId
   * @param bmGroupId
   */
  findOneByIdWithEntityTree(userId: number, bmGroupId: number): Promise<IBmGroup | undefined> {
    return this.createQueryBuilder('bg')
      .select(['bg.bmGroupId', 'bg.bmGroupName'])
      .innerJoin('bg.user', 'user')
      .leftJoinAndSelect('bg.bmGroupBookMarks', 'bgbm')
      .leftJoinAndSelect('bgbm.bookMark', 'bm')
      .where('user.id = :userId', { userId })
      .andWhere('bg.bmGroupId = :bmGroupId', { bmGroupId })
      .getOne();
  }

  /**
   * 로그인한 유저Id + bmGroupId를 사용하여 BM 그룹을 조회
   * @param userId
   * @param bmGroupId
   * @returns
   * - 조회 필드: ['bg.bmGroupId', 'bg.bmGroupName', 'user.id']
   */
  async findOneById(userId: number | string, bmGroupId: string | number): Promise<IBmGroup | undefined> {
    return this.createQueryBuilder('bg')
      .select(['bg.bmGroupId', 'bg.bmGroupName'])
      .innerJoin('bg.user', 'user')
      .where('user.id = :userId', { userId })
      .andWhere('bg.bmGroupId = :bmGroupId', { bmGroupId })
      .getOne();
  }

  /**
   * 로그인한 유저의 그룹중 bmGroupId에 해당하는 BM그룹을 삭제
   * @param userId
   * @param bmGroupId
   */
  async deleteOne(userId: number, bmGroupId: number): Promise<DeleteResult | undefined> {
    return this.createQueryBuilder()
      .delete()
      .from(BmGroup)
      .where('userId = :userId', { userId })
      .andWhere('bmGroupId = :bmGroupId', { bmGroupId })
      .execute();
  }
}
