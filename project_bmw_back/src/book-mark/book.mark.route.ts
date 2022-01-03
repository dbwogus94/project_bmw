import { Router } from 'express';
import { isAuth } from '@middleware/auth';
import dtoValidator from '@middleware/dto.validator';
import { SearchBookMarkDto } from './dto/request/search.book.mark.dto';
import { DeleteBookMarkDto } from './dto/request/delete.book.mark';
import { CreateBookMarkDto } from './dto/request/create.book.mark';
import { createBookMark, deleteBookMark, getBookMarks } from './book.mark.controller';

/* 모든 라우트 인증토큰 필수(isAuth 사용) */
/* Book Mark router: api/bookmarks */
const bookMarkRouter = Router();

// GET /api/bookmarks?routeId=:routeId&stationSeq=:stationSeq
// => 루트Id와 순번을 사용하여 일치하는 모든 북마크 조회
bookMarkRouter.get('/', dtoValidator(SearchBookMarkDto), isAuth, getBookMarks);

// POST /api/bookmarks
bookMarkRouter.post('/', dtoValidator(CreateBookMarkDto), isAuth, createBookMark);

// DELETE /api/bookmarks/:bookMarkId
bookMarkRouter.delete('/', dtoValidator(DeleteBookMarkDto), isAuth, deleteBookMark);

export default bookMarkRouter;
