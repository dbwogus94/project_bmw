import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import StatusCodes from 'http-status-codes';
import express, { NextFunction, Request, Response } from 'express';

import 'express-async-errors';

import BaseRouter from './routes';
import logger from '@shared/Logger';
import { config } from '@config';
import { errorMessages } from '@shared/message';

const app = express();
const { NOT_FOUND, INTERNAL_SERVER_ERROR } = StatusCodes;
const { INTERNAL_SERVER_ERROR_MESSAGE } = errorMessages;

/************************************************************************************
 *                              Set basic express settings
 ***********************************************************************************/

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(config.cookie.secret));
app.use(cors());

// Show routes called in console during development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Security
if (process.env.NODE_ENV === 'production') {
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
  logger.err(err, true);
  return res.status(INTERNAL_SERVER_ERROR).json(INTERNAL_SERVER_ERROR_MESSAGE);
});

export default app;
