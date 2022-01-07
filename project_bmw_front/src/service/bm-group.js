export default class BmGroupService {
  constructor(http) {
    this.http = http;
  }

  getBmGroupApi() {
    return `/bmgroups`;
  }

  getBookMarkApi(bmGroupId) {
    return `${this.getBmGroupApi()}/${bmGroupId}/bookmarks`;
  }

  /**
   * 유저의 모든 그룹 리스트 조회
   * - API: GET /api/bmgroups
   * @returns {Promise<BmGroup[]>}
   * - bmGroups:
    ```
    [
      {
        bmGroupId: 1,
        bmGroupName: jay_group_1,
        user: {
            username: jay
        },
        bmGroupBookMarkId: 1,
        bmGroupBookMarks: [
          bookMark: {...}
        ]
      },
    ]
    ```
   */
  async getBmGroups() {
    const url = this.getBmGroupApi();
    return this.http.fetch(url, { method: 'GET' });
  }

  /**
   * 조건에 일치하는 bookMark를 가진 그룹리스트를 조회한다.
   * - API: GET /api/bmgroups?routeId=:routeId&stationSeq=:stationSeq&statonId=:statonId
   * - 조건: 노선Id(routeId), 경유지순번(stationSeq), 정류소Id(stationId)
   * @param {number} routeId
   * @param {number} stationSeq
   * @param {number} stationId
   * @returns {Promise<BmGroup[]>}
   * - bmGroups 
   ```
   [
      bmGroup {
          bmGroupBookMarks: [
            bmGroupBookMark { 
              bookMark 
            }
          ]
      }
    ]
    ```
   */
  async searchBmGroups(routeId, stationSeq, stationId) {
    const url = `${this.getBmGroupApi()}?routeId=${routeId}&stationSeq=${stationSeq}&stationId=${stationId}`;
    const data = this.http.fetch(url, { method: 'GET' });
    return data;
  }

  /**
   * 신규 BM그룹 생성
   * - API: POST /api/bmgroups
   * @param {string} bmGroupName
   * @returns {Promise<BmGroup>}
   */
  async createBmGroup(bmGroupName) {
    const url = this.getBmGroupApi();
    return this.http.fetch(url, { method: 'POST', body: JSON.stringify({ bmGroupName }) });
  }

  /* ===================================================================================== */
  /* =================================== bookmarks api =================================== */
  /* ===================================================================================== */

  // GET /bmgroups/:bmGroupId/bookmakes?routeId=:routeId&stationSeq=:stationSeq&statonId

  /**
   * 조건에 일치하는 bookmakes를 조회한다.
   * - API: GET /bmgroups/:bmGroupId/bookmakes?routeId=:routeId&stationSeq=:stationSeq&statonId
   * - 조건: 노선Id(routeId), 경유지순번(stationSeq), 정류소Id(stationId)
   * @param {number} bmGroupId
   * @param {number} routeId
   * @param {number} stationSeq
   * @param {number} stationId
   * @returns {Promise<Bookmake[]>}
   */
  async searchBookMarks(bmGroupId, routeId, stationSeq, stationId) {
    const url = `${this.getBookMarkApi(bmGroupId)}?routeId=${routeId}&stationSeq=${stationSeq}&stationId=${stationId}`;
    const data = await this.http.fetch(url, { method: 'GET' });
    return data;
  }

  /**
   * bookMark 추가
   * - API: POST /bmgroups/:bmGroupId/bookmarks
   * @param {object} data - { ...info, ...station, bmGroupId, direction }
   * @returns {Promise<void>}
   */
  async createBookMark(data) {
    const { bmGroupId } = data;
    const url = this.getBookMarkApi(bmGroupId);
    await this.http.fetch(url, { method: 'POST', body: JSON.stringify(data) });
  }

  /**
   * bookMark 제거
   * - API: DELECT /bmgroups/:bmGroupId/bookmarks:bookMarkId
   * @param {number} bmGroupId
   * @param {number} bookMarkId
   * @returns {Promise<void>}
   */
  async deleteBookMark(bmGroupId, bookMarkId) {
    const url = `${this.getBookMarkApi(bmGroupId)}/${bookMarkId}`;
    await this.http.fetch(url, { method: 'DELETE' });
  }

  // ========================= 제거 예정 ===========================

  //
  /**
   *  bmGroupId에 해당하는 BMGroup 조회
   * 서버에서 전달받아야 하는 데이터 형태
   * @param {*} bmGroupId
   * @returns { bus: [], metro: [] }
   */
  async getBMGroup(bmGroupId) {
    const bmList = this.tweets.filter(tweet => tweet.bmGroupId === bmGroupId);
    const bus = bmList.filter(bm => bm.label === 'B');
    const metro = bmList.filter(bm => bm.label === 'M');
    return !!(bus.length || metro.length) //
      ? { bus, metro }
      : {};
  }

  /**
   * 전달받은 bmGroupId에 속하는 BMList 조회
   * -> 서버에서 도착시간이 빠른순 정렬하여 전달받아야 한다.
   * @param {*} bmGroupId
   * @returns list
   */
  async getBMList(bmGroupId) {
    return this.tweets.filter(tweet => tweet.bmGroupId === bmGroupId);
  }
}
