import { DeleteResult, EntityRepository, Repository } from 'typeorm';
import { BmGroupBookMark } from '@bmGroupBookMark/entities/BmGroupBookMark.entity';

export interface IBmGroupBookMarkRepository {
  deleteOne(bmGroupId: string | number, bookMarkId: string | number): Promise<DeleteResult | undefined>;
}

@EntityRepository(BmGroupBookMark)
export class BmGroupBookMarkRepository extends Repository<BmGroupBookMark> implements IBmGroupBookMarkRepository {
  async deleteOne(bmGroupId: string | number, bookMarkId: string | number): Promise<DeleteResult | undefined> {
    return this.createQueryBuilder()
      .delete()
      .from(BmGroupBookMark)
      .where('bmGroup = :bmGroupId', { bmGroupId })
      .andWhere('bookMark = :bookMarkId', { bookMarkId })
      .execute();
  }
}
