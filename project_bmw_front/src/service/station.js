export default class stationService {
  stopList = {};

  apiName = '/stations';
  constructor(http) {
    this.http = http;
  }

  /**
   * 정류소 이름으로 관련 정류소 리스트 조회
   * @param {string} routeName
   * @returns object
   * - { gyeonggi: gyeonggiStationList, seoul: seoulStationList }
   */
  async search(stationName) {
    return this.http.fetch(`${this.apiName}?stationName=${stationName}`, {
      method: 'GET',
    });
  }
}
