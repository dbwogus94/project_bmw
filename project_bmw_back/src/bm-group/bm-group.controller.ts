import { NextFunction, Request, Response } from 'express';
import { errorMessages } from '@shared/message';
import { StatusCodes } from 'http-status-codes';
import { BmGroupRepository } from './repository/bm-group.repository';
import { getCustomRepository } from 'typeorm';
import { UserRepository } from '@user/repository/user.repositroy';

const { OK, CREATED, NOT_FOUND } = StatusCodes;
const { NOT_FOUND_MESSAGE } = errorMessages;

/**
 * GET /bmgroups
 * - 로그인한 유저의 전체 그룹 리스트 조회
 *
 * GET /api/bmgroups?routeId=:routeId&stationSeq=:stationSeq&statonId=:statonId
 * - 로그인한 유저의 전체 그룹 리스트에서 조건으로 검색
 */
export const getBmGroups = async (req: Request, res: Response, next: NextFunction) => {
  const bmGroupRepository: BmGroupRepository = getCustomRepository(BmGroupRepository);
  const { routeId, stationSeq, statonId } = req.dto;

  const bmGroups =
    routeId && stationSeq && statonId
      ? await bmGroupRepository.findAllEntityTree(req.id, `${routeId}${stationSeq}${statonId}`)
      : await bmGroupRepository.findAll(req.id);

  return res.status(OK).json({ bmGroups });
};

/**
 * GET /bmgroups/:bmGroupId
 * - id가 ${bmGroupId}인 그룹 조회
 */
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

/**
 * POST /bmgroups
 * - 그룹생성
 */
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
