export default class MetroService {
  apiName = '/metros';
  constructor(http) {
    this.http = http;
  }

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

  async searchStationsByRouteId(routeId) {
    const metro = await this.http.fetch(`${this.apiName}/${routeId}/stations`, {
      method: 'GET',
    });

    const { metroName, metroCd, districtCd, metroStations } = metro;
    // 기점 역
    const startStationName = metroStations[0].stationName;
    // 종점 역
    const endStationName = metroStations[metroStations.length - 1].stationName;
    // info 객체 생성
    const info = { routeId, metroName, metroCd, districtCd, startStationName, endStationName };
    //
    const stations = metroStations.map(metroStation => {
      const { stationFrCode } = metroStation;
      return { ...metroStation, arsId: stationFrCode, routeId: routeId, routeName: metroName };
    });

    return {
      routeId,
      info,
      stations: stations,
    };
  }
}
