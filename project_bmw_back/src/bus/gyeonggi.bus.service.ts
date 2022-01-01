import { OpenApi } from '@shared/open.api';
import { BusService } from '@bus/bus.service.interface';
import { GyeonggiBusDto } from '@bus/dto/response/bus/gyeonggi.bus.dto';
import { GyeonggiBusInfoDto } from '@bus/dto/response/info/gyeonggi.info.dto';
import { GyeonggiBusStationDto } from '@bus/dto/response/station/gyeonggi.station.dto';

export class GyeonggiBusService implements BusService {
  private openApi: OpenApi;
  private HOST: string;
  private SERVICE_KEY: string;

  constructor(openApi: OpenApi, config: any) {
    const { host, key } = config.bus;
    this.openApi = openApi;
    this.HOST = host;
    this.SERVICE_KEY = key;
  }

  private errorHandler(resultCode: number, resultMessage: string) {
    throw Error(`[Gyeonggi_Bus_Service_API_ERROR] apiErrorCode: ${resultCode}, apiErrorMessage: ${resultMessage}`);
  }

  /**
   * 노선번호와 일치하는 모든 버스를 조회
   * @param routeName - 노선 번호
   * @returns Array<Bus>
   */
  async getBusListByRouteName(routeName: string): Promise<GyeonggiBusDto[]> {
    const SERVICE = 'getBusRouteList';
    const query = `&keyword=${routeName}`;
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
      ? result.map((bus: any) => {
          return new GyeonggiBusDto(bus);
        })
      : [new GyeonggiBusDto({ ...result })];
  }

  /**
   * 노선의 상세정보를 조회
   * @param routeId
   * @return Promise<GyeonggiBusInfoDto | null>
   */
  async getBusInfoByRouteId(routeId: number): Promise<GyeonggiBusInfoDto | null> {
    const SERVICE = 'getBusRouteInfoItem';
    const query = `&routeId=${routeId}`;
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

    return resultCode === 4 //
      ? null
      : new GyeonggiBusInfoDto(response.msgBody.busRouteInfoItem);
  }

  /**
   * 노선이 경유하는 정류소 정보를 조회
   * @param routeId 노선 id
   * @returns
   */
  async getStationsByRouteId(routeId: number): Promise<GyeonggiBusStationDto[]> {
    const SERVICE = 'getBusRouteStationList';
    const query = `&routeId=${routeId}`;
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

    return resultCode === 4
      ? []
      : response.msgBody.busRouteStationList.map((bus: any) => {
          return new GyeonggiBusStationDto(routeId, bus);
        });
  }
}
