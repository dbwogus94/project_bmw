import { Router } from 'express';
import { isAuth } from '@middleware/auth';
import dtoValidator from '@middleware/dto.validator';
import { GetBmGroupDto } from './dto/request/get.bm.group';
import { CreateBmGroupDto } from './dto/request/create.bm.group.dto';
import { createBmGroup, getBmGroup, getBmGroups } from './bm.group.controller';

/* 모든 라우트 인증토큰 필수(isAuth 사용) */
/* Bm Groups router: api/bmgroups */
const bmGroupRouter = Router();

// GET /api/bmgroups
bmGroupRouter.get('/', isAuth, getBmGroups);

// GET /api/bmgroups/:bmGroupId
bmGroupRouter.get('/:bmGroupId', dtoValidator(GetBmGroupDto), isAuth, getBmGroup);

// POST /api/bmgroups
bmGroupRouter.post('/', dtoValidator(CreateBmGroupDto), isAuth, createBmGroup);

export default bmGroupRouter;
