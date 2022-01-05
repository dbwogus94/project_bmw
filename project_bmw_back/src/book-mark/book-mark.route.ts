import { Router } from 'express';
import { isAuth } from '@middleware/auth';
import dtoValidator from '@middleware/dto.validator';
import { CreateBookMarkDto } from '@bookMark/dto/request/create-book-mark.dto';
import { DeleteBookMarkDto } from '@bookMark/dto/request/delete-book-mark.dto';
import { createBookMark, deleteBookMark } from '@bmGroup/bm-group.controller';

/* 모든 라우트 인증토큰 필수(isAuth 사용) */
/* book mark router: api/bmgroups/:bmGroupId/bookmarks */

const bookMarkRouter = Router({ mergeParams: true });

// GET /api/bmgroups/:bmGroupId/bookmakes?routeId=:routeId&stationSeq=:stationSeq&statonId
// bookMarkRouter.get('/:bmGroupId/bookmarks', dtoValidator(), isAuth);

// POST /bmgroups/:bmGroupId/bookmarks
bookMarkRouter.post('/', dtoValidator(CreateBookMarkDto), isAuth, createBookMark);

// DELECT /bmgroups/:bmGroupId/bookmarks:bookMarkId
bookMarkRouter.delete('/:bookMarkId', dtoValidator(DeleteBookMarkDto), isAuth, deleteBookMark);

export default bookMarkRouter;
