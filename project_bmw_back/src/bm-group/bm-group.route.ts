import { Router } from 'express';
import { isAuth } from '@middleware/auth';
import dtoValidator from '@middleware/dto.validator';
import { GetBmGroupDto } from './dto/request/get-bm-group.dto';
import { CreateBmGroupDto } from './dto/request/create-bm-group.dto';
import { createBmGroup, getBmGroup, getBmGroups } from './bm-group.controller';
import { SearchBmGroupDto } from './dto/request/search-bm-group.dto';

/* 모든 라우트 인증토큰 필수(isAuth 사용) */
/* Bm Groups router: api/bmgroups */
const bmGroupRouter = Router();

// GET /api/bmgroups
// GET /api/bmgroups?routeId=:routeId&stationSeq=:stationSeq&statonId=:statonId
bmGroupRouter.get('/', isAuth, dtoValidator(SearchBmGroupDto), getBmGroups);

// GET /api/bmgroups/:bmGroupId
bmGroupRouter.get('/:bmGroupId', dtoValidator(GetBmGroupDto), isAuth, getBmGroup);

// POST /api/bmgroups
bmGroupRouter.post('/', dtoValidator(CreateBmGroupDto), isAuth, createBmGroup);

export default bmGroupRouter;
