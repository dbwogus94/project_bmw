import { OpenApi } from '@shared/open.api';
import { BusService } from '@bus/bus.service.interface';
import { SeoulBusDto } from '@bus/dto/response/seoul.bus.dto';
import { Bus } from './dto/response/bus.dto.interface';
import { Station } from './dto/response/station/station.dto.interface';
import { SeoulStationDto } from './dto/response/station/seoul.station.dto';

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

  errorHandler(headerCd: number, headerMsg: string): Promise<Bus[]> {
    throw Error(`[Seoul_Bus_Service_API_ERROR] apiErrorCode: ${headerCd}, apiErrorMessage: ${headerMsg}`);
  }

  /**
   * 노선번호와 일치하는 모든 버스를 조회
   * @param routeName - 노선 번호
   * @returns Array<Bus>
   */
  async getBusListByRouteName(routeName: string) {
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

  async getStationsByRouteId(routeId: string | number): Promise<Station[]> {
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
          return new SeoulStationDto(bus);
        });
  }
}
