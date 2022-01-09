import { Router } from 'express';
import { isAuth } from '@middleware/auth';
import dtoValidator from '@middleware/dto.validator';
import { CreateBookMarkDto } from '@bookMark/dto/request/create-book-mark.dto';
import { DeleteBookMarkDto } from '@bookMark/dto/request/delete-book-mark.dto';
import { SearchBookMarkDto } from './dto/request/search-book-mark.dto';
import { createBookMark, deleteBookMark, searchBookMark } from './book-mark.controller';

/* 모든 라우트 인증토큰 필수(isAuth 사용) */
/* book mark router: api/bm-groups/:bmGroupId/book-marks */
const bookMarkRouter = Router({ mergeParams: true });

// GET /bm-groups/:bmGroupId/bookmakes?q=routeId=:routeId,stationSeq=:stationSeq,stationId=:stationId  // 검색용 쿼리 사용
// GET /bm-groups/:bmGroupId/bookmakes?routeId=:routeId&stationSeq=:stationSeq&stationId=:stationId    // 권장하지 않음
bookMarkRouter.get('/', dtoValidator(SearchBookMarkDto), isAuth, searchBookMark);

// POST /bm-groups/:bmGroupId/book-marks
bookMarkRouter.post('/', dtoValidator(CreateBookMarkDto), isAuth, createBookMark);

// DELECT /bm-groups/:bmGroupId/book-marks/:bookMarkId
bookMarkRouter.delete('/:bookMarkId', dtoValidator(DeleteBookMarkDto), isAuth, deleteBookMark);

export default bookMarkRouter;
