import { XMLParser } from 'fast-xml-parser';
import axios from 'axios';

export interface IOpenApi {
  parser: XMLParser;
  callApi: any;
}

class OpenApi implements IOpenApi {
  parser: XMLParser;

  constructor(parser: XMLParser) {
    this.parser = parser;
  }

  /**
   * xml to json parser
   * @param body - xml형식을 가진 문자열
   * @returns
   */
  private parseJson(body: string) {
    return this.parser.parse(body);
  }

  /**
   * open api호출하고 결과를 json으로 반환한다.
   * - open api에 따라 에러 응답이 다르다.
   * - 때문에 직접적인 에러 헨들링은 사용하는 곳에서 처리한다.
   * - 단, 200 응답이 오지 않은 경우에는 에러를 던진다.
   * @param url
   * @returns
   */
  async callApi(url: string, isXmlToJson: boolean = true) {
    try {
      const res = await axios({
        method: 'get',
        url,
      });

      // open API는 REST하지 않음. 요청이 잘못되어도 200으로 응답한다.
      if (res.status !== 200) {
        throw new Error('[OpenApi] API 서버에 장애가 있습니다.');
      }

      // xml to json
      return isXmlToJson ? this.parseJson(res.data) : res.data;
    } catch (error) {
      throw error;
    }
  }
}

let openApi: OpenApi;
export function getOpenApi(): OpenApi {
  if (!openApi) {
    openApi = new OpenApi(new XMLParser());
  }
  return openApi;
}
