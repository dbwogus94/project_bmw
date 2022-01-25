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
    const startStationName = metroStations[0].stationName;
    const endStationName = metroStations[metroStations.length - 1].stationName;
    const info = { routeId, metroName, metroCd, districtCd, startStationName, endStationName };
    const stations = metroStations.map(metroStation => ({ ...metroStation, routeId: routeId }));
    return {
      routeId,
      info,
      stations: stations,
    };
  }
}
