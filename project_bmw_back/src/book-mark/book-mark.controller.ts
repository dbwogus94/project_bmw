import { NextFunction, Request, Response } from 'express';
import { errorMessages } from '@shared/message';
import { StatusCodes } from 'http-status-codes';
import { getLogger } from '@shared/Logger';
import { BookMarkService, IBookMarkService } from './book-mark.service';

const { OK, CREATED, CONFLICT, NO_CONTENT, BAD_REQUEST, NOT_FOUND } = StatusCodes;
const { BAD_REQUEST_MESSAGE, NOT_FOUND_MESSAGE, CONFLICT_MESSAGE } = errorMessages;
const logger = getLogger();
const bookMarkService: IBookMarkService = new BookMarkService(logger);

/**
 * GET /bm-groups/:bmGroupId/bookmakes?q=routeId=:routeId,stationSeq=:stationSeq,stationId=:stationId
 * - 로그인한 유저의 그룹(bmGroupId)에 속한 북마크 조회
 */
export const searchBookMark = async (req: Request, res: Response, next: NextFunction) => {
  const { bmGroupId, routeId, stationSeq, stationId } = req.dto;
  // 검색용 키 생성(유니크)
  const checkColumn = `${routeId}${stationSeq}${stationId}`;

  try {
    const bookMark = await bookMarkService.findOneTreeByCheckColumn(req.id, bmGroupId, checkColumn);
    return bookMark //
      ? res.status(OK).json([bookMark])
      : res.status(OK).json([]);
  } catch (error: any) {
    if (error.code === 400) {
      return res.status(BAD_REQUEST).json({
        errCode: BAD_REQUEST,
        message: BAD_REQUEST_MESSAGE.createBookMark,
      });
    }
  }
};

/**
 * POST /bm-groups/:bmGroupId/book-marks
 * - 북마크 생성
 */
export const createBookMark = async (req: Request, res: Response, next: NextFunction) => {
  let bookMark: any;
  try {
    bookMark = await bookMarkService.createBookMark(req.id, req.dto);
  } catch (error: any) {
    const { code } = error;
    if (code === 400) {
      return res.status(BAD_REQUEST).json({
        errCode: BAD_REQUEST,
        message: BAD_REQUEST_MESSAGE.createBookMark,
      });
    }

    if (code === 409) {
      return res.status(CONFLICT).json({
        errCode: CONFLICT,
        message: CONFLICT_MESSAGE.createBookMark,
      });
    }
  }

  return res.status(CREATED).json(bookMark);
};

/**
 * DELECT /bm-groups/:bmGroupId/book-marks/:bookMarkId
 * - 북마크 삭제
 */
export const deleteBookMark = async (req: Request, res: Response, next: NextFunction) => {
  const { bmGroupId, bookMarkId } = req.dto;
  try {
    await bookMarkService.deleteBookMark(req.id, bmGroupId, bookMarkId);
    return res.sendStatus(NO_CONTENT);
  } catch (error: any) {
    const { code } = error;
    if (code === 400) {
      return res.status(BAD_REQUEST).json({
        errCode: BAD_REQUEST,
        message: BAD_REQUEST_MESSAGE.createBookMark,
      });
    }
    if (error.code === 404) {
      return res.status(NOT_FOUND).json({
        errCode: NOT_FOUND,
        message: NOT_FOUND_MESSAGE.deleteBookMark,
      });
    }
  }
};
