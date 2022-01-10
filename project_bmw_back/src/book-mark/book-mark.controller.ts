import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { getLogger } from '@shared/Logger';
import { BookMarkService, IBookMarkService } from './book-mark.service';

const { OK, CREATED, NO_CONTENT } = StatusCodes;
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

  const bookMark = await bookMarkService.findOneTreeByCheckColumn(req.id, bmGroupId, checkColumn);
  return bookMark //
    ? res.status(OK).json([bookMark])
    : res.status(OK).json([]);
};

/**
 * POST /bm-groups/:bmGroupId/book-marks
 * - 북마크 생성
 */
export const createBookMark = async (req: Request, res: Response, next: NextFunction) => {
  const bookMark = await bookMarkService.createBookMark(req.id, req.dto);
  return res.status(CREATED).json(bookMark);
};

/**
 * DELECT /bm-groups/:bmGroupId/book-marks/:bookMarkId
 * - 북마크 삭제
 */
export const deleteBookMark = async (req: Request, res: Response, next: NextFunction) => {
  const { bmGroupId, bookMarkId } = req.dto;
  await bookMarkService.deleteBookMark(req.id, bmGroupId, bookMarkId);
  return res.sendStatus(NO_CONTENT);
};
