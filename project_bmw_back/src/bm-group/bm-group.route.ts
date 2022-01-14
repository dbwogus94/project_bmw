import { Router } from 'express';
import { isAuth } from '@middleware/auth';
import dtoValidator from '@middleware/dto.validator';
import { GetBmGroupDto } from './dto/request/get-bm-group.dto';
import { CreateBmGroupDto } from './dto/request/create-bm-group.dto';
import { createBmGroup, deleteBmGroup, getBmGroup, getBmGroups } from './bm-group.controller';
import { SearchBmGroupDto } from './dto/request/search-bm-group.dto';
import { response } from '@middleware/response';
import { deleteBmGroupDto } from './dto/request/delete-bm-group.dto';

/* 모든 라우트 인증토큰 필수(isAuth 사용) */
/* Bm Groups router: api/bm-groups */
const bmGroupRouter = Router();

/* 
  include - 관계있는 자원까지 요청
  q - 검색쿼리 요청
*/

// GET /api/bm-groups
// GET /api/bm-groups?include=book-marks
// GET /api/bm-groups?include=book-marks&q=routeId=:routeId,stationSeq=:stationSeq,stationId=:stationId  // q 검색쿼리 사용
// GET /api/bm-groups?include=book-marks&routeId=:routeId&stationSeq=:stationSeq&stationId=:stationId    // 사용은 가능하지만 권장 x
bmGroupRouter.get('/', isAuth, dtoValidator(SearchBmGroupDto), getBmGroups, response);

// GET /api/bm-groups/:bmGroupId
// GET /api/bm-groups/:bmGroupId?include=book-marks
bmGroupRouter.get('/:bmGroupId', dtoValidator(GetBmGroupDto), isAuth, getBmGroup, response);

// POST /api/bm-groups
bmGroupRouter.post('/', dtoValidator(CreateBmGroupDto), isAuth, createBmGroup, response);

// DELETE /api/bm-groups/:bmGroupId
bmGroupRouter.delete('/:bmGroupId', dtoValidator(deleteBmGroupDto), isAuth, deleteBmGroup, response);

export default bmGroupRouter;
