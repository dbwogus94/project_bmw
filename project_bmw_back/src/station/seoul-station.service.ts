import { OpenApi } from '@src/shared/open-api';
import { SeoulStationDto } from './dto/response/station/seoul-station.dto';
import { StationService } from './station.service.interface';

export class SeoulStationService implements StationService {
  private openApi: OpenApi;
  private HOST: string;
  private SERVICE_KEY: string;

  constructor(openApi: OpenApi, config: { host: string; key: string }) {
    const { host, key } = config;
    this.openApi = openApi;
    this.HOST = host;
    this.SERVICE_KEY = key;
  }

  private errorHandler(headerCd: number, headerMsg: string) {
    throw Error(`[Seoul_Station_Service_API_ERROR] apiErrorCode: ${headerCd}, apiErrorMessage: ${headerMsg}`);
  }

  /**
   * 정류소 명으로 일치하는 모든 정류소 조회
   * @param stationName - 정류소 이름
   * @returns
   */
  async getStationListByStationName(stationName: string): Promise<SeoulStationDto[]> {
    const SERVICE = 'getStationByName';
    const query = `&stSrch=${encodeURI(stationName)}`;
    const apiUrl = `${this.HOST}/${SERVICE}?serviceKey=${this.SERVICE_KEY}${query}`;
    const { ServiceResult } = await this.openApi.callApi(apiUrl);

    const { headerCd, headerMsg } = ServiceResult.msgHeader;

    // headerCd: 0(정상), 4(결과 없음), 8(운행 종료)
    if (headerCd !== 0 && headerCd !== 4 && headerCd !== 8) {
      this.errorHandler(headerCd, headerMsg);
    }

    if (headerCd === 4 || headerCd === 8) {
      return [];
    }

    const result = ServiceResult.msgBody.itemList;
    return Array.isArray(result) //
      ? result.map((station: any) => {
          return new SeoulStationDto(station);
        })
      : [new SeoulStationDto({ ...result })];
  }
}
