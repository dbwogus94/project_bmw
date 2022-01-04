export default class BusService {
  apiName = '/buses';
  constructor(http) {
    this.http = http;
  }

  /**
   * 버스 노선으로 관련 버스 조회
   * @param {string} routeName
   * @returns object
   * - { gyeonggi: gyeonggiBusList, seoul: seoulBusList }
   */
  async search(routeName) {
    return this.http.fetch(`${this.apiName}?routeName=${routeName}`, {
      method: 'GET',
    });
  }

  /**
   * 버스 상세정보 조회
   * @param {number} routeId
   * @param {'gyeonggi' | 'seoul'} type
   * @returns object
   * - {routeId, type, info}
   */
  async searchInfoByRouteId(routeId, type) {
    const data = await this.http.fetch(`${this.apiName}/${routeId}?type=${type}`, {
      method: 'GET',
    });
    return data;
    // return this.info;
  }

  /**
   * 버스 경유정류장 조회
   * @param {number} routeId
   * @param {'gyeonggi' | 'seoul'} type
   * @returns object
   * - { routeId, type, info, stationList }
   */
  async searchStationsByRouteId(routeId, type) {
    // 상세정보, 정류장 리스트 동시 조회
    const [infoRes, stationsRes] = await Promise.all([
      this.http.fetch(`${this.apiName}/${routeId}?type=${type}`, { method: 'GET' }), //
      this.http.fetch(`${this.apiName}/${routeId}/stations?type=${type}`, { method: 'GET' }),
    ]);

    const { info } = infoRes;
    const { stationList } = stationsRes;

    return { routeId, type, info, stationList };
  }
}
