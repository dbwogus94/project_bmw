export default class BmGroupService {
  include = 'include=book-marks';

  constructor(http) {
    this.http = http;
  }

  getBmGroupApi() {
    return '/bm-groups';
  }

  getBookMarkApi(bmGroupId) {
    return `${this.getBmGroupApi()}/${bmGroupId}/book-marks`;
  }

  /**
   * 유저의 모든 그룹 리스트 조회
   * - API: GET /api/bmgroups
   * @returns {Promise<BmGroup[]>}
   * @param {boolean} isInclude
   * - if(isInclude) bmGroups
    ```
    [
      {
        bmGroupId: 1,
        bmGroupName: jay_group_1,
        bookMarks: [
          {
            "bookMarkId": 29,
            "checkColumn": "2290001114229000968",
            "routeId": 229000111,
            "stationSeq": 4,
            "stationId": 229000968,
            "label": "B",
            "routeName": "G7426",
            "stationName": "야당역.한빛마을5.9단지",
            "direction": "양재역.양재1동민원분소",
            "type": "gyeonggi"
          }
        ]
      },
    ]
    ```
   */
  async getBmGroups(isInclude = false) {
    const url = isInclude //
      ? `${this.getBmGroupApi()}?${this.include}`
      : `${this.getBmGroupApi()}`;
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
      { 
        "bmGroupId": 1,
        "bmGroupName": "jay_group_1",
        "bookMarks": [
          {
            "bookMarkId": 29,
            "checkColumn": "2290001114229000968",
            "routeId": 229000111,
            "stationSeq": 4,
            "stationId": 229000968,
            "label": "B",
            "routeName": "G7426",
            "stationName": "야당역.한빛마을5.9단지",
            "direction": "양재역.양재1동민원분소",
            "type": "gyeonggi"
          }
        ]
      }
    ]
  ```
   */
  async searchBmGroups(routeId, stationSeq, stationId) {
    const searchQuery = `q=routeId=${routeId},stationSeq=${stationSeq},stationId=${stationId}`;
    const url = `${this.getBmGroupApi()}?${this.include}&${searchQuery}`;
    return this.http.fetch(url, { method: 'GET' });
  }

  /**
   * 
   * @param {number} bmGroupId 
   * @param {boolean} isInclude 
   * @returns {Promise<BmGroup>}
    * - if(isInclude) bmGroup
    ```
    { 
      "bmGroupId": 1,
      "bmGroupName": "jay_group_1",
      "bookMarks": [
        {
          "bookMarkId": 29,
          "checkColumn": "2290001114229000968",
          "routeId": 229000111,
          "stationSeq": 4,
          "stationId": 229000968,
          "label": "B",
          "routeName": "G7426",
          "stationName": "야당역.한빛마을5.9단지",
          "direction": "양재역.양재1동민원분소",
          "type": "gyeonggi"
        }
      ]
    }
    ```
   */
  async getGroupById(bmGroupId, isInclude = false) {
    const url = isInclude //
      ? `${this.getBmGroupApi()}/${bmGroupId}?${this.include}`
      : `${this.getBmGroupApi()}/${bmGroupId}`;
    return this.http.fetch(url, { method: 'GET' });
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
    const searchQuery = `q=routeId=${routeId},stationSeq=${stationSeq},stationId=${stationId}`;
    const url = `${this.getBookMarkApi(bmGroupId)}?${searchQuery}`;
    const data = await this.http.fetch(url, { method: 'GET' });
    return data;
  }

  /**
   * bookMark 추가
   * - API: POST /bmgroups/:bmGroupId/bookmarks
   * @param {object} data - { ...info, ...station, bmGroupId, direction }
   * @returns {Promise<bmGroupBookMark>}
   *
   * - bmGroupBookMark
   ```
    {
      "bmGroupBookMarkId": 180,
      "bookMark": {
          "bookMarkId": 29,
          "checkColumn": "2290001114229000968",
          "routeId": 229000111,
          "stationSeq": 4,
          "stationId": 229000968,
          "label": "B",
          "routeName": "G7426",
          "stationName": "야당역.한빛마을5.9단지",
          "direction": "양재역.양재1동민원분소",
          "type": "gyeonggi"
        }
    }
   ```
   */
  async createBookMark(data) {
    const { bmGroupId } = data;
    const url = this.getBookMarkApi(bmGroupId);
    return this.http.fetch(url, { method: 'POST', body: JSON.stringify(data) });
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
    return this.http.fetch(url, { method: 'DELETE' });
  }
}
