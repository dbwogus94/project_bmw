import { OpenApi } from '@shared/open-api';
import { BusService } from '@bus/bus.service.interface';
import { SeoulBusDto } from '@bus/dto/response/bus/seoul-bus.dto';
import { SeoulBusInfoDto } from '@bus/dto/response/info/seoul-info.dto';
import { SeoulBusStationDto } from '@bus/dto/response/station/seoul-station.dto';
import { SeoulArrivalDto } from './dto/response/arrival/seoul-arrival.dto';

export class SeoulBusService implements BusService {
  private openApi: OpenApi;
  private HOST: string;
  private ARRIVAL: string;
  private SERVICE_KEY: string;

  constructor(openApi: OpenApi, config: any) {
    const { host, key, arrival } = config.bus;
    this.openApi = openApi;
    this.HOST = host;
    this.ARRIVAL = arrival;
    this.SERVICE_KEY = key;
  }

  private errorHandler(headerCd: number, headerMsg: string) {
    throw Error(`[Seoul_Bus_Service_API_ERROR] apiErrorCode: ${headerCd}, apiErrorMessage: ${headerMsg}`);
  }

  /**
   * 노선번호와 일치하는 모든 버스를 조회
   * @param routeName - 노선 번호
   * @returns Promise<Bus[]>
   */
  async getBusListByRouteName(routeName: string): Promise<SeoulBusDto[]> {
    const SERVICE = 'getBusRouteList';
    const query = `&strSrch=${encodeURI(routeName)}`;
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
      ? result.map((bus: any) => {
          return new SeoulBusDto(bus);
        })
      : [new SeoulBusDto({ ...result })];
  }

  /**
   * 노선의 상세정보를 조회
   * @param routeId - 노선ID
   * @retrun Promise<SeoulBusInfoDto>
   */
  async getBusInfoByRouteId(routeId: number): Promise<SeoulBusInfoDto | null> {
    const SERVICE = 'getRouteInfo';
    const query = `&busRouteId=${routeId}`;
    const apiUrl = `${this.HOST}/${SERVICE}?serviceKey=${this.SERVICE_KEY}${query}`;
    const { ServiceResult } = await this.openApi.callApi(apiUrl);

    const { headerCd, headerMsg } = ServiceResult.msgHeader;

    // headerCd: 0(정상), 4(결과 없음), 8(운행 종료)
    if (headerCd !== 0 && headerCd !== 4 && headerCd !== 8) {
      this.errorHandler(headerCd, headerMsg);
    }

    return headerCd === 4 || headerCd === 8 //
      ? null
      : new SeoulBusInfoDto(ServiceResult.msgBody.itemList);
  }

  /**
   * 노선이 경유하는 정류소 정보를 조회
   * @param routeId - 노선 id
   * @returns Promise<Station[]>
   */
  async getStationsByRouteId(routeId: number): Promise<SeoulBusStationDto[]> {
    const SERVICE = 'getStaionByRoute';
    const query = `&busRouteId=${routeId}`;
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
    const { itemList } = ServiceResult.msgBody;

    // inOutTag, direction 부여
    const { seq, stationNm } = itemList.find((station: any) => station.transYn === 'Y');

    const turnStationSeq: number = seq;
    const turnStationName: string = stationNm;
    const startStationName: string = itemList[0].stationNm;

    const stations: any[] = itemList.map((station: any) => {
      const { seq } = station;
      return {
        ...station,
        inOutTag: seq < turnStationSeq ? '1' : '2',
        direction: seq < turnStationSeq ? turnStationName : startStationName,
      };
    });

    return stations.map((station: any) => new SeoulBusStationDto(station));
  }

  async getArrivalInfo(routeId: number, stationId: number, stationSeq: number): Promise<SeoulArrivalDto> {
    const SERVICE = 'getArrInfoByRoute';
    const query = `&stId=${stationId}&busRouteId=${routeId}&ord=${stationSeq}`;
    const apiUrl = `${this.ARRIVAL}/${SERVICE}?serviceKey=${this.SERVICE_KEY}${query}`;
    const { ServiceResult } = await this.openApi.callApi(apiUrl);

    const { headerCd, headerMsg } = ServiceResult.msgHeader;

    // headerCd: 0(정상), 4(결과 없음), 8(운행 종료)
    if (headerCd !== 0 && headerCd !== 4 && headerCd !== 8) {
      this.errorHandler(headerCd, headerMsg);
    }

    return new SeoulArrivalDto(ServiceResult.msgBody.itemList);
  }
}
