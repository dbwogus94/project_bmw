// lib
import 'express-async-errors';
import cookieParser from 'cookie-parser';
import express, { NextFunction, Request, Response } from 'express';
import StatusCodes from 'http-status-codes';
import helmet from 'helmet';
import cors from 'cors';
// my module
import { createLogger, getLogger } from '@shared/logger';
import customMorgan from '@middleware/custom.morgan';
import BaseRouter from '@routes/index';
import { config } from '@config';
import { errorMessages } from '@shared/message';

// winston 로거 생성
createLogger('api-server');
const logger = getLogger();

const app = express();
const { NOT_FOUND, INTERNAL_SERVER_ERROR } = StatusCodes;
const { INTERNAL_SERVER_ERROR_MESSAGE } = errorMessages;
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

// Add APIs
app.use('/api', BaseRouter);

// 404 처리
app.use((req: Request, res: Response) => {
  logger.info('[라우트 없음 : 404] ' + req.url);
  res.sendStatus(NOT_FOUND);
});

// 500 : 서버 에러 처리 미들웨어
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err);
  return res.status(INTERNAL_SERVER_ERROR).json(INTERNAL_SERVER_ERROR_MESSAGE);
});

export default app;
