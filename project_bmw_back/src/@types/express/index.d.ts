import { IUser } from '@entities/User';
import { ResponseData } from '@middleware/response';
import { IClientData } from '@shared/jwt.service';
import { Dto } from '../user/dto/dto.interface';

declare module 'express' {
  export interface Request {
    body: {
      user: IUser;
      email: string;
      password: string;
    };
  }
}

declare global {
  namespace Express {
    export interface Response {
      sessionUser: IClientData;
    }

    // Express.Requset에 프로퍼티 추가
    interface Request {
      dto: Dto;
      id: number;
      username: string;
      responseData: ResponseData;
    }
  }
}
