import { ClassType, transformAndValidate } from 'class-transformer-validator';
import { NextFunction, Request, Response } from 'express';
import { errorMessages } from '@shared/message';
import { StatusCodes } from 'http-status-codes';
const { BAD_REQUEST } = StatusCodes;
/**
 * Dto 유효성 검사기
 * 1. 요청 body(json || query)를 Dto로 매핑 후 유효성 검사 실행
 * 2. 유효성 검사 통과 next() 호출
 * 3. 에러 발생 400 코드 응답
 * @param DtoClass - interface Dto를 구현한 dto 클래스
 * @returns
 */
export default function (DtoClass: ClassType<object>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = { ...req.body, ...req.query }; // 우선순위 query
      const dtoObject = await transformAndValidate(DtoClass, data);
      req.dto = dtoObject;
      next();
    } catch (errors) {
      res.status(BAD_REQUEST).json(makeErrorMsg(errors));
    }
  };

  function makeErrorMsg(errors: any) {
    const result = errors.reduce((accumulator: any, error: any) => {
      const { property, value, constraints } = error;
      accumulator.push({
        errCode: BAD_REQUEST,
        property, // 오류 필드
        message: getKorMsg(constraints), // 오류 내용
        errValue: value, // 오류 값
      });

      return accumulator;
    }, []);

    return result;

    function getKorMsg(object: any) {
      return Object.keys(object).reduce((accumulator: any, key: any) => {
        accumulator.push(errorMessages.BAD_REQUEST_MESSAGE[key]);
        return accumulator;
      }, []);
    }
  }
}
