import { IOpenApi } from '@shared/open-api';
import { BusService } from '@bus/bus.service.interface';
import { GyeonggiBusDto } from '@bus/dto/response/bus/gyeonggi-bus.dto';
import { GyeonggiBusInfoDto } from '@bus/dto/response/info/gyeonggi-info.dto';
import { GyeonggiBusStationDto } from '@bus/dto/response/station/gyeonggi-station.dto';
import { GyeonggiArrivalDto } from './dto/response/arrival/gyeonggi-arrival.dto';
import { HttpError } from '@shared/http.error';

export class GyeonggiBusService implements BusService {
  private openApi: IOpenApi;
  private HOST: string;
  private ARRIVAL: string;
  private SERVICE_KEY: string;

  constructor(openApi: IOpenApi, config: any) {
    const { host, key, arrival } = config.bus;
    this.openApi = openApi;
    this.HOST = host;
    this.ARRIVAL = arrival;
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
    const query = `&keyword=${encodeURI(routeName)}`;
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

    if (resultCode === 4) {
      return [];
    }
    const { busRouteStationList } = response.msgBody;

    // inOutTag, direction 부여
    const { stationSeq, stationName } = busRouteStationList.find((station: any) => station.turnYn === 'Y');
    const turnStationSeq: number = stationSeq;
    const turnStationName: string = stationName;
    const startStationName: string = busRouteStationList[0].stationName;

    const stations: any[] = busRouteStationList.map((station: any) => {
      const { stationSeq } = station;
      return {
        ...station,
        routeId,
        // 상행(1) 하행(2) 여부
        inOutTag: stationSeq < turnStationSeq ? '1' : '2',
        // 진행 방향
        direction: stationSeq < turnStationSeq ? turnStationName : startStationName,
      };
    });

    return stations.map((station: any) => new GyeonggiBusStationDto(station));
  }

  /**
   * 노선 도착정보 조회
   * @param routeId 노선 id
   * @param stationId 경유 정류소 id
   * @param stationSeq 경유 정류소 순번
   * @returns
   */
  async getArrivalInfo(routeId: number, stationId: number, stationSeq: number): Promise<GyeonggiArrivalDto> {
    const SERVICE = 'getBusArrivalItem';
    const query = `&stationId=${stationId}&routeId=${routeId}&staOrder=${stationSeq}`;
    const apiUrl = `${this.ARRIVAL}/${SERVICE}?serviceKey=${this.SERVICE_KEY}${query}`;
    const temp = await this.openApi.callApi(apiUrl);
    const { response, OpenAPI_ServiceResponse } = temp;
    // OpenAPI_ServiceResponse 값이 있으면 API 키가 잘못된것
    if (OpenAPI_ServiceResponse) {
      const { returnReasonCode, returnAuthMsg } = OpenAPI_ServiceResponse.cmmMsgHeader;
      this.errorHandler(returnReasonCode, returnAuthMsg);
    }

    if (!response.msgHeader) {
      // TODO: 경기도 버스 도착정보 서비스 간헐적으로 연결 오류 발생.
      throw new HttpError(500, 'Gyeonggi_getArrivalInfo');
    }

    const { resultCode, resultMessage } = response.msgHeader;

    if (resultCode !== 0 && resultCode !== 4) {
      this.errorHandler(resultCode, resultMessage);
    }

    return resultCode === 4 //
      ? new GyeonggiArrivalDto({ routeId, stationId, stationSeq, flag: 'STOP' })
      : new GyeonggiArrivalDto(response.msgBody.busArrivalItem);
  }
}
