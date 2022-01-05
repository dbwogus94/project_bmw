import { NextFunction, Request, Response } from 'express';
import { errorMessages } from '@shared/message';
import { StatusCodes } from 'http-status-codes';
import { getConnection, getCustomRepository } from 'typeorm';
import { BookMarkRepository } from '@bookMark/repository/book-mark.repository';
import { BmGroupBookMarkRepository } from '@bmGroupBookMark/repository/bmgroup-bookmark.repository';
import { getLogger } from '@shared/Logger';
import { BmGroupBookMark } from '@bmGroupBookMark/entities/BmGroupBookMark.entity';
import { BmGroupRepository } from '@bmGroup/repository/bm-group.repository';

const { CREATED, NO_CONTENT, BAD_REQUEST } = StatusCodes;
const { BAD_REQUEST_MESSAGE } = errorMessages;
const logger = getLogger();

// POST /bmgroups/:bmGroupId/bookmarks
export const createBookMark = async (req: Request, res: Response, next: NextFunction) => {
  const bookMarkRepo: BookMarkRepository = getCustomRepository(BookMarkRepository);
  const bmGroupRepo: BmGroupRepository = getCustomRepository(BmGroupRepository);
  const bmGroupBookMarkRepo: BmGroupBookMarkRepository = getCustomRepository(BmGroupBookMarkRepository);
  const { bmGroupId, routeId, stationSeq, stationId } = req.dto;

  const queryRunner = getConnection().createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  await queryRunner.commitTransaction();
  try {
    // 중복확인 키 생성
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
    const bmGroup = await bmGroupRepo.findOneById(req.id, bmGroupId);
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

// DELECT /bmgroups/:bmGroupId/bookmarks:bookMarkId
export const deleteBookMark = async (req: Request, res: Response, next: NextFunction) => {
  const bmGroupRepo: BmGroupRepository = getCustomRepository(BmGroupRepository);
  const bmGroupBookMarkRepo: BmGroupBookMarkRepository = getCustomRepository(BmGroupBookMarkRepository);
  const { bmGroupId, bookMarkId } = req.dto;

  const bmGroup = await bmGroupRepo.findOneById(req.id, bmGroupId);
  if (!bmGroup) {
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
