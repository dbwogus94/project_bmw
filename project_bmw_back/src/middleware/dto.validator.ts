import { ClassType, transformAndValidate } from 'class-transformer-validator';
import { NextFunction, Request, Response } from 'express';
import { errorMessage } from '../message';

/**
 * Dto 유효성 검사기
 * 1. 요청 body(json)를 Dto로 매핑 후 유효성 검사 실행
 * 2. 유효성 검사 통과 next() 호출
 * 3. 에러 발생 400 코드 응답
 * @param DtoClass - interface Dto를 구현한 dto 클래스
 * @returns
 */
export default function (DtoClass: ClassType<object>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dtoObject = await transformAndValidate(DtoClass, req.body);
      req.dto = dtoObject;
      next();
    } catch (errors) {
      res.status(400).json(makeErrorMsg(errors));
    }
  };

  function makeErrorMsg(errors: any) {
    console.log(errors);
    const result = errors.reduce((accumulator: any, error: any) => {
      const { property, value, constraints } = error;
      accumulator.push({
        errCode: 400,
        property, // 오류 필드
        message: getKorMsg(constraints), // 오류 내용
        errValue: value, // 오류 값
      });

      return accumulator;
    }, []);

    return result;

    function getKorMsg(object: any) {
      return Object.keys(object).reduce((accumulator: any, key: any) => {
        accumulator.push(errorMessage[key]);
        return accumulator;
      }, []);
    }
  }
}
