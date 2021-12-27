import { OpenApi } from '@shared/open.api';
import { BusService } from '@bus/bus.service.interface';
import { SeoulBusDto } from '@bus/dto/response/bus/seoul.bus.dto';
import { SeoulBusInfoDto } from '@bus/dto/response/info/seoul.info.dto';
import { SeoulBusStationDto } from '@bus/dto/response/station/seoul.station.dto';

export class SeoulBusService implements BusService {
  private openApi: OpenApi;
  private HOST: string;
  private SERVICE_KEY: string;

  constructor(openApi: OpenApi, config: any) {
    const { host, key } = config.bus;
    this.openApi = openApi;
    this.HOST = host;
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
    const query = `&strSrch=${routeName}`;
    const apiUrl = `${this.HOST}/${SERVICE}?serviceKey=${this.SERVICE_KEY}${query}`;
    const { ServiceResult } = await this.openApi.callApi(apiUrl);

    const { headerCd, headerMsg } = ServiceResult.msgHeader;

    // headerCd: 0(정상), 4(결과 없음), 8(운행 종료)
    if (headerCd !== 0 && headerCd !== 4 && headerCd !== 8) {
      this.errorHandler(headerCd, headerMsg);
    }

    return headerCd === 4 || headerCd === 8
      ? []
      : ServiceResult.msgBody.itemList.map((bus: any) => {
          return new SeoulBusDto(bus);
        });
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

    return headerCd === 4 || headerCd === 8
      ? []
      : ServiceResult.msgBody.itemList.map((bus: any) => {
          return new SeoulBusStationDto(bus);
        });
  }
}
