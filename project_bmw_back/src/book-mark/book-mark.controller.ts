import { NextFunction, Request, Response } from 'express';
import { errorMessages } from '@shared/message';
import { StatusCodes } from 'http-status-codes';
import { getConnection, getCustomRepository } from 'typeorm';
import { BookMarkRepository } from '@bookMark/repository/book-mark.repository';
import { BmGroupBookMarkRepository } from '@bmGroupBookMark/repository/bmgroup-bookmark.repository';
import { getLogger } from '@shared/Logger';
import { BmGroupRepository } from '@bmGroup/repository/bm-group.repository';

const { OK, CREATED, NO_CONTENT, BAD_REQUEST, CONFLICT } = StatusCodes;
const { BAD_REQUEST_MESSAGE, CONFLICT_MESSAGE } = errorMessages;
const logger = getLogger();

const getBmGroup = async (userId: number, bmGroupId: number) => {
  const bmGroupRepo: BmGroupRepository = getCustomRepository(BmGroupRepository);
  return bmGroupRepo.findOneById(userId, bmGroupId);
};

/**
 * GET /bmgroups/:bmGroupId/bookmakes?routeId=:routeId&stationSeq=:stationSeq&stationId
 * - 로그인한 유저의 그룹(bmGroupId)에 속한 북마크 조회
 */
export const searchBookMark = async (req: Request, res: Response, next: NextFunction) => {
  const bookMarkRepo: BookMarkRepository = getCustomRepository(BookMarkRepository);
  const { bmGroupId, routeId, stationSeq, stationId } = req.dto;
  // 검색용 키 생성(유니크)
  const checkColumn = `${routeId}${stationSeq}${stationId}`;

  const isBmGroup = !!(await getBmGroup(req.id, bmGroupId));
  if (!isBmGroup) {
    return res.status(BAD_REQUEST).json({
      errCode: BAD_REQUEST,
      message: BAD_REQUEST_MESSAGE.createBookMark,
    });
  }

  const bookMark = await bookMarkRepo.findTreeByCheckColumn(req.id, bmGroupId, checkColumn);
  return bookMark //
    ? res.status(OK).json([bookMark])
    : res.status(OK).json([]);
};

/**
 * POST /bmgroups/:bmGroupId/bookmarks
 * - 북마크 생성
 */
export const createBookMark = async (req: Request, res: Response, next: NextFunction) => {
  const bookMarkRepo: BookMarkRepository = getCustomRepository(BookMarkRepository);
  const bmGroupBookMarkRepo: BmGroupBookMarkRepository = getCustomRepository(BmGroupBookMarkRepository);
  const { bmGroupId, routeId, stationSeq, stationId } = req.dto;

  const queryRunner = getConnection().createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  await queryRunner.commitTransaction();
  try {
    // 검색용 키 생성(유니크)
    const checkColumn = `${routeId}${stationSeq}${stationId}`;

    // 1. Insert book_mark
    let bookMark: any;
    try {
      const newBookMark = bookMarkRepo.create({ ...req.dto, checkColumn });
      bookMark = await bookMarkRepo.save(newBookMark);
    } catch (error) {
      // 이미 있는 북마크면? => 조회
      bookMark = await bookMarkRepo.findOneByCheckColumn(checkColumn);
    }

    // 2. Select bm_group
    const bmGroup = await getBmGroup(req.id, bmGroupId);
    if (!bmGroup) {
      return res.status(BAD_REQUEST).json({
        errCode: BAD_REQUEST,
        message: BAD_REQUEST_MESSAGE.createBookMark,
      });
    }

    // 3. Insert bmgroup_bookmark
    try {
      const bmGroupBookMark = bmGroupBookMarkRepo.create({ bmGroup, bookMark });
      await bmGroupBookMarkRepo.save(bmGroupBookMark);
    } catch (error) {
      // bmGroupId, bookMarkId 중복되면? => 그룹에 이미 추가된 bookMake이다.
      // => ALTER TABLE bmgroup_bookmark ADD UNIQUE(bmGroupId, bookMarkId)
      return res.status(CONFLICT).json({
        errCode: CONFLICT,
        message: CONFLICT_MESSAGE.createBookMark,
      });
    }
  } catch (error) {
    await queryRunner.rollbackTransaction();
    logger.error('createBookMark Rollback 발생:');
    logger.error(error);
    throw error;
  } finally {
    await queryRunner.release();
  }

  return res.sendStatus(CREATED);
};

/**
 * DELECT /bmgroups/:bmGroupId/bookmarks:bookMarkId
 * - 북마크 삭제
 */
export const deleteBookMark = async (req: Request, res: Response, next: NextFunction) => {
  const bmGroupBookMarkRepo: BmGroupBookMarkRepository = getCustomRepository(BmGroupBookMarkRepository);
  const { bmGroupId, bookMarkId } = req.dto;

  const isBmGroup = !!(await getBmGroup(req.id, bmGroupId));
  if (!isBmGroup) {
    return res.status(BAD_REQUEST).json({
      errCode: BAD_REQUEST,
      message: BAD_REQUEST_MESSAGE.createBookMark,
    });
  }

  try {
    await bmGroupBookMarkRepo.deleteOne(bmGroupId, bookMarkId);
  } catch (error) {
    logger.error(error);
    throw error;
  }

  res.sendStatus(NO_CONTENT);
};
