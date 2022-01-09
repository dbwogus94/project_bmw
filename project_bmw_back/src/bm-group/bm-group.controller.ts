import { NextFunction, Request, Response } from 'express';
import { errorMessages } from '@shared/message';
import { StatusCodes } from 'http-status-codes';
import { BmGroupRepository } from './repository/bm-group.repository';
import { getCustomRepository } from 'typeorm';
import { UserRepository } from '@user/repository/user.repositroy';

const { OK, CREATED, NOT_FOUND } = StatusCodes;
const { NOT_FOUND_MESSAGE } = errorMessages;

/**
 * GET /bm-groups
 * - 로그인한 유저의 전체 그룹 리스트 조회(book-mark 포함 x)
 *
 * GET /api/bm-groups?include
 * - 로그인한 유저의 전체 그룹 리스트 조회(book-mark 포함 o)
 *
 * GET /api/bm-groups?include=book-mark&q=routeId=:routeId,stationSeq=:stationSeq,stationId=:stationId // q 검색쿼리 사용
 * GET /api/bm-groups?include=book-mark&routeId=:routeId&stationSeq=:stationSeq&stationId=:stationId   // 사용 가능하지만 권장 x
 * - 로그인한 유저의 전체 그룹 리스트에서 조건으로 검색(book-mark 포함 o)
 */
export const getBmGroups = async (req: Request, res: Response, next: NextFunction) => {
  const bmGroupRepository: BmGroupRepository = getCustomRepository(BmGroupRepository);
  const { include, routeId, stationSeq, stationId } = req.dto;
  const { id } = req;
  let bmGroups;

  if (include && !(routeId && stationSeq && stationId)) {
    bmGroups = await bmGroupRepository.gatBmGroupsWithEntityTree(req.id);
    return res.status(OK).json(bmGroups);
  }

  if (include && !!(routeId && stationSeq && stationId)) {
    const searchKey = `${routeId}${stationSeq}${stationId}`;
    bmGroups = await bmGroupRepository.searchBmGroupsWithEntityTree(id, searchKey);
    return res.status(OK).json(bmGroups);
  }

  bmGroups = await bmGroupRepository.findById(id);
  return res.status(OK).json(bmGroups);
};

/**
 * GET /bm-groups/:bmGroupId
 * - id가 ${bmGroupId}인 그룹 조회
 *
 * GET /api/bm-groups/:bmGroupId?include=book-marks
 * - id가 ${bmGroupId}인 그룹 조회 (book-marks 포함 o)
 */
export const getBmGroup = async (req: Request, res: Response, next: NextFunction) => {
  const bmGroupRepository: BmGroupRepository = getCustomRepository(BmGroupRepository);
  const { include, bmGroupId } = req.dto;
  const { id } = req;
  let bmGroup;

  if (include) {
    bmGroup = await bmGroupRepository.findOneByIdWithEntityTree(id, bmGroupId);
  } else {
    bmGroup = await bmGroupRepository.findOneById(id, bmGroupId);
  }

  if (!bmGroup) {
    return res.status(NOT_FOUND).json({
      errCode: NOT_FOUND_MESSAGE.code,
      message: NOT_FOUND_MESSAGE.getBmGroup,
    });
  }

  return res.status(OK).json(bmGroup);
};

/**
 * POST /bm-groups
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

  return res.status(CREATED).json(bmGroup);
};
