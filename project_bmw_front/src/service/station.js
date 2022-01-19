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

  /**
   * 정류소에 정차하는 노선 검색
   * @param {number} stationId || arsId - 정류소id 또는 정류소 고유번호
   * @param {'gyeonggi' | 'seoul'} type
   * @returns
   *  - {busList: []}
   */
  async getBusList(stationId, type) {
    const { busList } = await this.http.fetch(`${this.apiName}/${stationId}/buses?type=${type}`, {
      method: 'GET',
    });
    return busList;
  }
}
