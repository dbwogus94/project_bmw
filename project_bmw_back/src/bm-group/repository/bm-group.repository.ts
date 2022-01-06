import { EntityRepository, Repository } from 'typeorm';
import { BmGroup, IBmGroup } from '@bmGroup/entities/BmGroup.entity';
import { BookMark } from '@bookMark/entities/BookMark.entity';
import { transformAndValidate } from 'class-transformer-validator';
import { BookMarkDto } from '@bookMark/dto/response/book-mark.dto';

export interface IBmGroupRepository {
  gatBmGroupsWithEntityTree(userId: number): Promise<IBmGroup[]>;
  searchBmGroupsWithEntityTree(userId: number, checkColumn: string): Promise<any[]>;
  findOneById(userId: number, bmGroupId: number): Promise<IBmGroup | undefined>;
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
  async searchBmGroupsWithEntityTree(userId: string | number, checkColumn: string): Promise<any[]> {
    const rawDatas = await this.createQueryBuilder('bg')
      .select('bg.bmGroupId', 'bmGroupId') // 'user.username'
      .addSelect('bg.bmGroupName', 'bmGroupName')
      .addSelect('bgbm.bmGroupBookMarkId', 'bmGroupBookMarkId')
      .innerJoin('bg.user', 'user')
      .leftJoin('bg.bmGroupBookMarks', 'bgbm')
      .leftJoinAndSelect(
        subQuery => subQuery.select().from(BookMark, 'bm').where('bm.checkColumn = :checkColumn', { checkColumn }),
        'bm',
        'bm.bookMarkId = bgbm.bookMarkId',
      )
      .where('user.id = :userId', { userId })
      .groupBy('bg.bmGroupId')
      .orderBy('bg.bmGroupId', 'ASC')
      .getRawMany(); // 서브쿼리 사용하면 getMany() 정상 사용불가

    // BmGroup Entity로 변환
    return Promise.all(
      rawDatas.map(async rawData => {
        const { bmGroupId, bmGroupName, bmGroupBookMarkId } = rawData;
        const bmGroupBookMarks: any = [];
        return rawData.bookMarkId
          ? {
              bmGroupId,
              bmGroupName,
              bmGroupBookMarks: [
                {
                  bmGroupBookMarkId, //
                  bookMark: await transformAndValidate(BookMarkDto, rawData),
                },
              ],
            }
          : { bmGroupId, bmGroupName, bmGroupBookMarks };
      }),
    );
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
