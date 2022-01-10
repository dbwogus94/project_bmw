import { ClassType, transformAndValidate } from 'class-transformer-validator';
import { NextFunction, Request, Response } from 'express';
import { errorMessages } from '@shared/message';
import { StatusCodes } from 'http-status-codes';
import { HttpError } from '@shared/http.error';
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
      // TODO: params, body, query에 중복되는 데이터를 허용하지 않고 있음.
      const data = { ...req.params, ...req.body, ...req.query }; // 최우선순위 query
      // 검색 키워드가 q에 담겨온 경우 파싱
      const searchQuery = getSearchQuery(req.query);
      const dtoObject = await transformAndValidate(DtoClass, { ...data, ...searchQuery });
      req.dto = dtoObject;
      next();
    } catch (errors) {
      throw new HttpError(BAD_REQUEST, 'validator', makeErrorMsg(errors));
    }
  };

  function makeErrorMsg(errors: any) {
    const result = errors.reduce((accumulator: any, error: any) => {
      const { property, value, constraints } = error;
      accumulator.push({
        errCode: BAD_REQUEST,
        property, // 오류 필드
        messages: getKorMsg(constraints), // 오류 내용
        errValue: !(value === undefined) && Number.isNaN(value) ? 'NaN' : value, // 오류 값
      });

      return accumulator;
    }, []);

    return result;

    function getKorMsg(object: any) {
      return Object.keys(object).reduce((accumulator: any, key: any) => {
        const korMsg = errorMessages.BAD_REQUEST_MESSAGE.validate[key];
        const detailMsg = object[key];
        accumulator[key] = { korMsg, detailMsg };
        return accumulator;
      }, {});
    }
  }

  /**
   * 검색용 쿼리 파싱
   * - 요청 query에서 key 'q'의 값은 검색에 사용하는 키워드이다.
   * - ex) GET url?q=routeId=:routeId,stationSeq=:stationSeq,stationId=:stationId
   * @param query
   * @returns
   */
  function getSearchQuery(query: any): object {
    const { q } = query;
    if (!q) {
      return {};
    }
    // 1) ,를 기준으로 split
    const queryStrings = q.split(',');
    // 2) = 기준으로 key 값으로 변환
    return queryStrings.reduce((pre: any, cur: any) => {
      const obj: any = {};
      const temp = cur.split('=');
      obj[temp[0]] = temp[1];
      return { ...pre, ...obj };
    }, {});
  }
}
