import { getHttpSuccessMessages } from '@shared/message';
import { Request, Response } from 'express';

export interface ResponseData {
  statusCode: number;
  message: string;
  data?: any | undefined;
}

export function response(req: Request, res: Response) {
  const { message, statusCode, data } = req.responseData;
  return res.status(statusCode).json({
    status: statusCode + '',
    message: getHttpSuccessMessages(statusCode)[message],
    data,
  });
}
