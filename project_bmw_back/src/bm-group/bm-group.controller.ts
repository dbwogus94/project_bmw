import { NextFunction, Request, Response } from 'express';
import { BmGroupService, IBmGroupService } from './bm-group.service';
import { HttpError } from '@shared/http.error';

const bmGroupService: IBmGroupService = new BmGroupService();

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
  const { include, routeId, stationSeq, stationId } = req.dto;
  const { id } = req;
  let bmGroups;
  const responseData = {
    statusCode: 200,
    message: 'getBmGroups',
  };

  // GET /api/bm-groups?include
  if (include && !(routeId && stationSeq && stationId)) {
    bmGroups = await bmGroupService.findBmGroupsWithEntityTree(req.id);
    req.responseData = { ...responseData, data: bmGroups };
    return next();
  }

  // GET /api/bm-groups?include=book-mark&q=routeId=:routeId,stationSeq=:stationSeq,stationId=:stationId // q 검색쿼리 사용
  if (include && !!(routeId && stationSeq && stationId)) {
    const searchKey = `${routeId}${stationSeq}${stationId}`;
    bmGroups = await bmGroupService.searchBmGroupsWithEntityTree(id, searchKey);
    req.responseData = { ...responseData, data: bmGroups };
    return next();
  }

  // GET /bm-groups
  bmGroups = await bmGroupService.findById(id);
  req.responseData = { ...responseData, data: bmGroups };
  return next();
};

/**
 * GET /bm-groups/:bmGroupId
 * - id가 ${bmGroupId}인 그룹 조회
 *
 * GET /api/bm-groups/:bmGroupId?include=book-marks
 * - id가 ${bmGroupId}인 그룹 조회 (book-marks 포함 o)
 */
export const getBmGroup = async (req: Request, res: Response, next: NextFunction) => {
  const { include, bmGroupId } = req.dto;
  const { id } = req;
  let bmGroup;

  if (include) {
    // GET /api/bm-groups/:bmGroupId?include=book-marks
    bmGroup = await bmGroupService.findOneByIdWithEntityTree(id, bmGroupId);
  } else {
    // GET /bm-groups/:bmGroupId
    bmGroup = await bmGroupService.findOneById(id, bmGroupId);
  }

  if (!bmGroup) {
    throw new HttpError(400, 'getBmGroup');
  }

  req.responseData = {
    statusCode: 200,
    message: 'getBmGroup',
    data: bmGroup,
  };
  return next();
};

/**
 * POST /bm-groups
 */
export const createBmGroup = async (req: Request, res: Response, next: NextFunction) => {
  const { bmGroupName } = req.dto;
  const bmGroup = await bmGroupService.createBmGroup(req.id, bmGroupName);
  req.responseData = {
    statusCode: 201,
    message: 'createBmGroup',
    data: bmGroup,
  };
  return next();
};
