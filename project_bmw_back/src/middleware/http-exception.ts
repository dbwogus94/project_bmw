import { HttpError } from '@shared/http.error';
import { getHttpName, getHttpErrorMessage } from '@shared/message';
import { Request, Response } from 'express';

export default function (err: HttpError, req: Request, res: Response) {
  const { code, message, detail } = err;

  return res.status(code).json({
    status: code + '',
    error: getHttpName(code), // 상태 명
    message: getHttpErrorMessage(code)[message],
    path: req.url,
    errors: detail ? detail : undefined, // 에러 상세 객체
  });
}
