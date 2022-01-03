import { NextFunction, Request, Response } from 'express';
import { errorMessages } from '@shared/message';
import { StatusCodes } from 'http-status-codes';

const { OK, NOT_FOUND } = StatusCodes;

// GET /bmgroups
export const getBmGroups = (req: Request, res: Response, next: NextFunction) => {
  res.status(OK).json({ message: 'getBmGroups test' });
};

// GET /bmgroups/:bmGroupId
export const getBmGroup = (req: Request, res: Response, next: NextFunction) => {
  res.status(OK).json({ message: 'getBmGroups test', dto: req.dto });
};

// POST /bmgroups
export const createBmGroup = (req: Request, res: Response, next: NextFunction) => {
  res.status(OK).json({ message: 'createBmGroup test', dto: req.dto });
};
