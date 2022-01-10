import { IBmGroup } from '@bmGroup/entities/BmGroup.entity';
import { BmGroupRepository } from '@bmGroup/repository/bm-group.repository';
import { BmGroupBookMarkRepository } from '@bmGroupBookMark/repository/bmgroup-bookmark.repository';
import { getConnection, getCustomRepository } from 'typeorm';
import { BookMarkRepository } from './repository/book-mark.repository';
import { Logger } from 'winston';
import { CreateBookMarkDto } from './dto/request/create-book-mark.dto';
import { HttpError } from '@shared/http.error';
import { BookMarkDto } from './dto/response/book-mark.dto';
import { transformAndValidate } from 'class-transformer-validator';

export interface IBookMarkService {
  findOneTreeByCheckColumn(userId: number, bmGroupId: number, checkColumn: string): Promise<BookMarkDto | undefined>;
  createBookMark(userId: number, dto: CreateBookMarkDto): Promise<BookMarkDto>;
  deleteBookMark(userId: number, bmGroupId: number, bookMarkId: number): Promise<void>;
}

export class BookMarkService implements IBookMarkService {
  private logger: Logger;
  constructor(logger: Logger) {
    this.logger = logger;
  }

  // BookMarkService 내부용 공통 메서드
  private async getBmGroup(userId: number, bmGroupId: number): Promise<IBmGroup | undefined> {
    const bmGroupRepo: BmGroupRepository = getCustomRepository(BmGroupRepository);
    return bmGroupRepo.findOneById(userId, bmGroupId);
  }

  /**
   * 테이블을 join하여 조건에 일치하는 bookMark 조회
   * - checkColumn의 값은 유니크 하기 때문에 단일값 리턴
   * - join된 테이블: bmgroup_bookmark, bm_group, book_mark
   * @param userId
   * @param bmGroupId - 조회할 북마크(bookMark)를 가진 bm그룹(bmGroup)
   * @param checkColumn - String(routeId) + String(stationSeq) + String(stationId)
   * @returns
   */
  async findOneTreeByCheckColumn(
    userId: number,
    bmGroupId: number,
    checkColumn: string,
  ): Promise<BookMarkDto | undefined> {
    const bookMarkRepo: BookMarkRepository = getCustomRepository(BookMarkRepository);
    const isBmGroup = !!(await this.getBmGroup(userId, bmGroupId));
    if (!isBmGroup) {
      throw new HttpError(400, 'BAD_REQUEST');
    }
    const entity = await bookMarkRepo.findOneTreeByCheckColumn(userId, bmGroupId, checkColumn);
    return entity //
      ? transformAndValidate(BookMarkDto, { ...entity })
      : undefined;
  }

  /**
   * 신규 북마크와 관계 생성
   * 1. Insert book_mark
   * 2. Select bm_group
   * 3. Insert bmgroup_bookmark
   * @param userId
   * @param dto
   * @returns
   */
  async createBookMark(userId: number, dto: CreateBookMarkDto): Promise<BookMarkDto> {
    const bookMarkRepo: BookMarkRepository = getCustomRepository(BookMarkRepository);
    const bmGroupBookMarkRepo: BmGroupBookMarkRepository = getCustomRepository(BmGroupBookMarkRepository);
    const { bmGroupId, routeId, stationSeq, stationId } = dto;
    let bookMark;
    let httpError;
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    await queryRunner.commitTransaction();
    try {
      // 검색용 키 생성(유니크)
      const checkColumn = `${routeId}${stationSeq}${stationId}`;

      // 1. Insert book_mark
      try {
        const newBookMark = bookMarkRepo.create({ ...dto, checkColumn });
        bookMark = await bookMarkRepo.save(newBookMark);
      } catch (error) {
        // 이미 있는 북마크면? => 조회
        bookMark = await bookMarkRepo.findOneByCheckColumn(checkColumn);
      }

      // 2. Select bm_group
      const bmGroup = await this.getBmGroup(userId, bmGroupId);
      if (!bmGroup) {
        httpError = new HttpError(400, 'BAD_REQUEST');
        throw httpError;
      }

      // 3. Insert bmgroup_bookmark
      try {
        const bmGroupBookMark = bmGroupBookMarkRepo.create({ bmGroup, bookMark });
        await bmGroupBookMarkRepo.save(bmGroupBookMark);
      } catch (error) {
        httpError = new HttpError(409, 'CONFLICT');
        throw httpError;
      }
    } catch (error) {
      this.logger.error('createBookMark Rollback 발생:');
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
      if (httpError) throw httpError; // controller에 에러 전달
    }

    return transformAndValidate(BookMarkDto, { ...bookMark });
  }

  /**
   * 북마크제거
   * - bmgroup_bookmark 테이블의 연관관계만 제거
   * @param bmGroupId
   * @param bookMarkId
   */
  async deleteBookMark(userId: number, bmGroupId: number, bookMarkId: number): Promise<void> {
    const bmGroupBookMarkRepo: BmGroupBookMarkRepository = getCustomRepository(BmGroupBookMarkRepository);
    const isBmGroup = !!(await this.getBmGroup(userId, bmGroupId));
    if (!isBmGroup) {
      throw new HttpError(400, 'BAD_REQUEST');
    }

    // BM그룹, 북마크 연결 테이블에서 매핑 관계 제거
    const result = await bmGroupBookMarkRepo.deleteOne(bmGroupId, bookMarkId); // affected
    const { affected } = result!;
    if (!affected) {
      throw new HttpError(404, 'NOT_FOUND');
    }
  }
}
