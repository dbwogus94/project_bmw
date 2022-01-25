import { StationService } from './station.service.interface';
import { OpenApi } from '@shared/open-api';
import { GyeonggiStationDto } from './dto/response/station/gyeonggi-station.dto';
import { GyeonggiBusDto } from '@bus/dto/response/bus/gyeonggi-bus.dto';

export class GyeonggiStationService implements StationService {
  private openApi: OpenApi;
  private HOST: string;
  private SERVICE_KEY: string;

  constructor(openApi: OpenApi, config: { host: string; key: string }) {
    const { host, key } = config;
    this.openApi = openApi;
    this.HOST = host;
    this.SERVICE_KEY = key;
  }

  private errorHandler(resultCode: number, resultMessage: string) {
    throw Error(`[Gyeonggi_Station_Service_API_ERROR] apiErrorCode: ${resultCode}, apiErrorMessage: ${resultMessage}`);
  }

  /**
   * 정류소 명으로 일치하는 모든 정류소 조회
   * @param stationName - 정류소 이름
   * @returns
   */
  async getStationListByStationName(stationName: string): Promise<GyeonggiStationDto[]> {
    const SERVICE = 'getBusStationList';
    const query = `&keyword=${encodeURI(stationName)}`;
    const apiUrl = `${this.HOST}/${SERVICE}?serviceKey=${this.SERVICE_KEY}${query}`;
    const { response, OpenAPI_ServiceResponse } = await this.openApi.callApi(apiUrl);

    // OpenAPI_ServiceResponse 값이 있으면 API 키가 잘못된것
    if (OpenAPI_ServiceResponse) {
      const { returnReasonCode, returnAuthMsg } = OpenAPI_ServiceResponse.cmmMsgHeader;
      this.errorHandler(returnReasonCode, returnAuthMsg);
    }

    const { resultCode, resultMessage } = response.msgHeader;

    // resultCode: 0(정상), 4(결과 없음)
    if (resultCode !== 0 && resultCode !== 4) {
      this.errorHandler(resultCode, resultMessage);
    }

    if (resultCode === 4) {
      return [];
    }

    const result = response.msgBody.busStationList;
    return Array.isArray(result)
      ? result.map((station: any) => {
          return new GyeonggiStationDto(station);
        })
      : [new GyeonggiStationDto({ ...result })];
  }

  async getStopBusListByStationId(stationId: number | string): Promise<GyeonggiBusDto[]> {
    const SERVICE = 'getBusStationViaRouteList';
    const query = `&stationId=${stationId}`;
    const apiUrl = `${this.HOST}/${SERVICE}?serviceKey=${this.SERVICE_KEY}${query}`;
    const { response, OpenAPI_ServiceResponse } = await this.openApi.callApi(apiUrl);

    // OpenAPI_ServiceResponse 값이 있으면 API 키가 잘못된것
    if (OpenAPI_ServiceResponse) {
      const { returnReasonCode, returnAuthMsg } = OpenAPI_ServiceResponse.cmmMsgHeader;
      this.errorHandler(returnReasonCode, returnAuthMsg);
    }

    const { resultCode, resultMessage } = response.msgHeader;

    // resultCode: 0(정상), 4(결과 없음)
    if (resultCode !== 0 && resultCode !== 4) {
      this.errorHandler(resultCode, resultMessage);
    }

    if (resultCode === 4) {
      return [];
    }

    const result = response.msgBody.busRouteList;
    return Array.isArray(result)
      ? result.map((station: any) => {
          return new GyeonggiBusDto(station);
        })
      : [new GyeonggiBusDto({ ...result })];
  }
}
