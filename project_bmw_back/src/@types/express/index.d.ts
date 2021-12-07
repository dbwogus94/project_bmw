import { IUser } from '@entities/User';
import { IClientData } from '@shared/JwtService';
import { Dto } from '../dto/dto.interface';

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
    }
  }
}
