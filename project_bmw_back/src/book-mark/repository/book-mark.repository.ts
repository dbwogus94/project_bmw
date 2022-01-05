import { EntityRepository, Repository } from 'typeorm';
import { BookMark } from '@bookMark/entities/BookMark.entity';

export interface IBookMarkRepository {
  findOneByCheckColumn(checkColumn: string): Promise<BookMark | undefined>;
}

@EntityRepository(BookMark)
export class BookMarkRepository extends Repository<BookMark> implements IBookMarkRepository {
  async findOneByCheckColumn(checkColumn: string): Promise<BookMark | undefined> {
    return this.findOne({ where: [{ checkColumn }] });
  }
}
