import { EntityRepository, Repository } from 'typeorm';
import { BookMark, IBookMark } from '@bookMark/entities/BookMark.entity';

export interface IBookMarkRepository {
  findOneByCheckColumn(checkColumn: string): Promise<IBookMark | undefined>;
  findOneTreeByCheckColumn(userId: number, bmGroupId: number, checkColumn: string): Promise<IBookMark | undefined>;
}

@EntityRepository(BookMark)
export class BookMarkRepository extends Repository<BookMark> implements IBookMarkRepository {
  /**
   * 유니크 키인 checkColumn를 사용하여 bookMark 조회
   * @param checkColumn - String(routeId) + String(stationSeq) + String(stationId)
   * @returns - BookMark
   */
  async findOneByCheckColumn(checkColumn: string): Promise<IBookMark | undefined> {
    return this.findOne({ where: [{ checkColumn }] });
  }

  /**
   * 테이블을 join하여 조건에 일치하는 bookMark 조회
   * - join된 테이블: bmgroup_bookmark, bm_group, book_mark
   * @param userId
   * @param bmGroupId 조회할 북마크(bookMark)를 가진 bm그룹(bmGroup)
   * @param checkColumn - String(routeId) + String(stationSeq) + String(stationId)
   * @returns - BookMark
   */
  async findOneTreeByCheckColumn(
    userId: number,
    bmGroupId: number,
    checkColumn: string,
  ): Promise<IBookMark | undefined> {
    return this.createQueryBuilder('bm')
      .select(['bm'])
      .innerJoin('bm.bmGroupBookMarks', 'bgbm')
      .innerJoin('bgbm.bmGroup', 'bg')
      .innerJoin('bg.user', 'user')
      .where('user.id = :userId', { userId })
      .andWhere('bg.bmGroupId = :bmGroupId', { bmGroupId })
      .andWhere('bm.checkColumn = :checkColumn', { checkColumn }) // 22900006775229000968
      .getOne();
  }
}
