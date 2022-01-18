// lib
import 'express-async-errors';
import cookieParser from 'cookie-parser';
import express, { NextFunction, Request, Response } from 'express';
import StatusCodes from 'http-status-codes';
import helmet from 'helmet';
import cors from 'cors';
// my module
import { getLogger } from '@shared/Logger';
import customMorgan from '@middleware/custom-morgan';
import { config } from '@config';
import { HttpError } from '@shared/http.error';
import httpException from '@middleware/http-exception';
// my router
import AuthRouter from '@auth/auth.route';
import BusRouter from '@bus/bus.route';
import bmGroupRouter from '@bmGroup/bm-group.route';
import bookMarkRouter from '@bookMark/book-mark.route';
import stationRouter from '@station/station.route';

// winston 로거 생성
const logger = getLogger();

const app = express();
const { credentials, origin } = config.server.cors;

/************************************************************************************
 *                              Set basic express settings
 ***********************************************************************************/

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(config.cookie.secret));
app.use(
  cors({
    origin,
    credentials,
  }),
);

app.use(customMorgan());

// Security
if (config.environment === 'production') {
  app.use(helmet());
}

// express 프록시 설정
//  https://expressjs.com/ko/guide/behind-proxies.html
app.set('trust proxy', true);

// Add APIs
app.use('/api/auth', AuthRouter);
app.use('/api/buses', BusRouter);
app.use('/api/stations', stationRouter);
app.use('/api/bm-groups', bmGroupRouter);
app.use('/api/bm-groups/:bmGroupId/book-marks', bookMarkRouter);

// 404 처리
app.use((req: Request, res: Response) => {
  // logger.info('[라우트 없음 : 404] ' + req.url);
  return httpException(new HttpError(404, 'not_found'), req, res);
});

// 500 : 서버 에러 처리 미들웨어
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof HttpError) return httpException(err, req, res);
  logger.error(err);
  return httpException(new HttpError(500, 'serverError'), req, res);
});

export default app;
