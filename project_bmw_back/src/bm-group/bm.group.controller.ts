import { NextFunction, Request, Response } from 'express';
import { errorMessages } from '@shared/message';
import { StatusCodes } from 'http-status-codes';
import { BmGroupRepository } from './repository/bm.group.repository';
import { getCustomRepository } from 'typeorm';
import { UserRepository } from '@user/repository/user.repositroy';

const { OK, CREATED, NOT_FOUND } = StatusCodes;
const { NOT_FOUND_MESSAGE } = errorMessages;

// GET /bmgroups
export const getBmGroups = async (req: Request, res: Response, next: NextFunction) => {
  const bmGroupRepository: BmGroupRepository = getCustomRepository(BmGroupRepository);
  return res.status(OK).json({ bmGroups: await bmGroupRepository.findAll(req.id) });
};

// GET /bmgroups/:bmGroupId
export const getBmGroup = async (req: Request, res: Response, next: NextFunction) => {
  const { bmGroupId } = req.dto;
  const bmGroupRepository: BmGroupRepository = getCustomRepository(BmGroupRepository);
  const bmGroup = await bmGroupRepository.findOneById(req.id, bmGroupId);

  if (!bmGroup) {
    return res.status(NOT_FOUND).json({
      errCode: NOT_FOUND_MESSAGE.code,
      message: NOT_FOUND_MESSAGE.getBmGroup,
    });
  }

  return res.status(OK).json({ bmGroup });
};

// POST /bmgroups
export const createBmGroup = async (req: Request, res: Response, next: NextFunction) => {
  const { bmGroupName } = req.dto;
  const userRepository: UserRepository = getCustomRepository(UserRepository);
  const bmGroupRepository: BmGroupRepository = getCustomRepository(BmGroupRepository);

  const user = await userRepository.findByUserId(req.id);
  const bmGroup = bmGroupRepository.create({
    user,
    bmGroupName,
  });
  await bmGroupRepository.save(bmGroup);

  return res.status(CREATED).json({ bmGroup });
};
