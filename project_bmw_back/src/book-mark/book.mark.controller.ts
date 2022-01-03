import { NextFunction, Request, Response } from 'express';
import { errorMessages } from '@shared/message';
import { StatusCodes } from 'http-status-codes';

const { OK, NOT_FOUND } = StatusCodes;

// GET /bookmarks?routeId=:routeId&stationSeq=:stationSeq
export const getBookMarks = (req: Request, res: Response, next: NextFunction) => {
  res.status(OK).json({ message: 'getBookMarks test', dto: req.dto });
};

// POST /bookmarks
export const createBookMark = (req: Request, res: Response, next: NextFunction) => {
  res.status(OK).json({ message: 'createBookMark test', dto: req.dto });
};

// DELETE /bookmarks/:bookMarkId
export const deleteBookMark = (req: Request, res: Response, next: NextFunction) => {
  res.status(OK).json({ message: 'deleteBookMark test', dto: req.dto });
};
