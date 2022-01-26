export default class MetroService {
  apiName = '/metros';
  constructor(http) {
    this.http = http;
  }

  /**
   * 지하철 역 검색
   * @param {*} stationName
   * @returns
   */
  async search(stationName) {
    const metros = stationName
      ? await this.http.fetch(`${this.apiName}?include=stations&q=stationName=${stationName}`, {
          method: 'GET',
        })
      : await this.http.fetch(`${this.apiName}`, {
          method: 'GET',
        });
    return metros;
  }

  /**
   * 노선 id에 해당하는 노선 조회(역 리스트 포함)
   * @param {number} routeId
   * @returns {routeId, info, stations}
   *
   */
  async searchStationsByRouteId(routeId) {
    const metro = await this.http.fetch(`${this.apiName}/${routeId}/stations`, {
      method: 'GET',
    });
    const { metroName, metroCd, districtCd, startStationName, endStationName, metroStations } = metro;

    // info 객체 생성
    const info = { routeId, metroName, metroCd, districtCd, startStationName, endStationName };

    // stations 객체 가공
    const stations = metroStations.map(metroStation => {
      return { ...metroStation, routeId: routeId, routeName: metroName };
    });

    return {
      routeId,
      info,
      stations: stations,
    };
  }
}
