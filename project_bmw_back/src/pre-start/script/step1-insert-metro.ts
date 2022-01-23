import { promises } from 'fs';
import { join } from 'path';
// api
import { OpenApi } from '@shared/open-api';
// typeorm
import { MetroRepository } from '@metro/repository/metro.repository';
import { Connection, getCustomRepository } from 'typeorm';
import { Metro } from '@metro/entities/Metro.entity';
// dto
import { CreateMetroDto } from '@metro/dto/request/create-metro.dto';
import { transformAndValidate } from 'class-transformer-validator';
// import { seoulMetroData } from './seoul-metro-data';

interface StationData {
  stationName: string;
  stationCd: string;
  stationFrCode: string;
  stationSeq: number;
}

export default async (conn: Connection, api: OpenApi, apiConfig: any) => {
  const fileName = './seoul-metro-data.ts'; // 동적으로 생성할 파일명
  const { host, key } = apiConfig.seoul.metro;

  try {
    // 1) 노선별 정거장 순서를 찾을수 있는 데이터 웹에서 동적 가져와 생성한다.
    await createSeoulMetroDataFile(fileName);
    const { seoulMetroData } = await import(fileName);
    const metroRepo: MetroRepository = getCustomRepository(MetroRepository);

    /*===================== # 1. metro table insert ====================== */
    // 1) CreateMetroDto에 담을 데이터 가공
    const metroDatas = Object.keys(seoulMetroData).map((key: any) => {
      const { attr } = seoulMetroData[key];
      return { metroName: attr['data-label'], metroCd: key, districtCd: 1 };
    });

    // 2) CreateMetroDto생성
    const metroDtos = await transformAndValidate(CreateMetroDto, metroDatas);

    // 3) metro insert 실행
    await metroRepo.insertMay(metroDtos);

    // 4) 생성된 전체 metro Entity를 조회한다.
    const metros = await metroRepo.find();

    /*===================== # 2. metro_station table insert ====================== */

    // 1) open api로 모든 노선별 정류장 데이터를 조회한다.
    const rawDateArr = await Promise.all(metros.map(metro => callStationsData(metro)));

    // 2) metro_station 테이블에 insert할 데이터를 가공한다.
    const stationData2ndArr: any[][] = makeStationDatas(seoulMetroData, rawDateArr);

    // 3) metro_station에 insert 실행
    // 부모인 Metro를 통해 자식객체인 MetroStations를 추가한다.
    await Promise.all(
      metros.map((metro: Metro, i: number) => {
        // 기존 데이터가 없으니 할당으로 처리,
        // 기존 자식 데이터가 있는경우는 **push() 해야한다.
        metro.metroStations = stationData2ndArr[i];
        return metroRepo.save(metro);
      }),
    );
  } catch (error) {
    console.error('[ERROR] ::: step1-insert-metro');
    throw error;
  }

  /**
   * 서울 교통공사 웹 사이트의 데이터를 사용하여 ts 파일 생성
   * - 이 데이터를 통해 열차 순서 정보를 알 수 있다.
   */
  async function createSeoulMetroDataFile(fileName: string): Promise<void> {
    try {
      let data = await api.callApi('http://www.seoulmetro.co.kr/kr/getLineData.do', false);
      data = data.replace('var lines', 'export const seoulMetroData: any');
      data = data.replace(/"sub-nm": "",/gi, '');
      await promises.writeFile(join(__dirname, fileName), data);
    } catch (error) {
      console.error('[writeMetroData] 서울 교통공사 js 데이터를 가져오는데 실패 했습니다.');
      throw error;
    }
  }

  /**
   * 서울시 열린데이터 광장 OPEN API 호출
   * - 서울시 지하철역 정보 검색 (역명)
   * @param metroName - 노선 이름
   * @returns
    ```
    metroCd: '2', 
    metroName: '2호선',
    row: [
      {
      "STATION_CD": "0228",
      "STATION_NM": "서울대입구",
      "STATION_NM_ENG": "Seoul Nat`l Univ.",
      "LINE_NUM": "02호선",
      "FR_CODE": "228"
      },
        ...
    ]
    ```
    * @throws api Error
    */
  async function callStationsData(metro: Metro): Promise<{ metroCd: string; metroName: String; rawStations: any[] }> {
    const { metroCd, metroName } = metro;
    const serviceName = 'SearchSTNBySubwayLineInfo';
    const url = `${host}/${key}/json/${serviceName}/1/300/ / /${encodeURI(getMetroNames(metroName))}`;
    const { SearchSTNBySubwayLineInfo } = await api.callApi(url, false);

    if (!SearchSTNBySubwayLineInfo) {
      throw Error('["getStationsByMetroName"] ::: API 요청이 잘못되었습니다.');
    }

    const { RESULT, row } = SearchSTNBySubwayLineInfo;
    if (!RESULT || RESULT.CODE !== 'INFO-000') {
      const { CODE, MESSAGE } = RESULT;
      const message = `['getStationsByMetroName'] ::: code: ${CODE}, message: ${MESSAGE ?? '정의되지 않음.'}`;
      throw Error(message);
    }

    return { metroCd, metroName, rawStations: row };

    function getMetroNames(metroName: string) {
      switch (metroName) {
        case '2호선':
          return '02호선';
        case '김포골드라인':
          return '김포';
        case '인천1호선':
          return '인천선';
        case '경의·중앙선':
          return '경의선';
        default:
          return metroName;
      }
    }
  }

  /**
   *
   * @param seoulMetroData - 서울 교통공사 웹 사이트 데이터
   * @param stationsDatas - 서울시 열린데이터 광장 OPEN API로 조회한 노선별 정류장 데이터
   * @returns
   */
  function makeStationDatas(
    seoulMetroData: any,
    stationsDatas: { metroCd: string; metroName: String; rawStations: any[] }[],
  ): StationData[][] {
    // 1) 서울 교통공사 웹 사이트에서 가져온 seoulMetroData에서 노선(motroCd)별 역 코드(station-cd)를 추출한다.
    const stationCdsObj = getMetroStationCdsByOrder(seoulMetroData);

    // 2) 1차 가공: StationData에 담을 데이터 만든다.
    return stationsDatas.map((stationsData, i: number) => {
      const { metroCd, rawStations } = stationsData;

      const stationDatas: any[] = rawStations.map((rawStation: any) => {
        const { STATION_CD, STATION_NM, FR_CODE } = rawStation;
        return {
          stationName: STATION_NM, // 역 이름
          stationCd: STATION_CD, // 역 코드
          stationFrCode: FR_CODE, // 역 외부 코드
          stationSeq: null, // 역 순서는 다음 단계 부여
        };
      });

      // 3) 2차가공: stationCdsObj를 사용하여 stationSeq를 부여한다.
      return makeStationDatas(stationDatas, stationCdsObj[metroCd]);
    });

    /**
     * seoulMetroData에서 노선(motroCd)별 역 코드(station-cd)를 추출한다.
     * - seoulMetroData에는 노선별로 정류장 데이터가 순서대로 담겨 있다.
     * - 즉, 이 함수의 리턴 값은 노선별 정류장 순서를 가리킨다.
     * @returns 
     ```
    {
        1: ['0200', '0249', '0248', ... ]   // 1호선의 정류장 순서대로 담긴다.
        2: ['3139', '3138', '3137', ...]    // 2호선의 정류장 순서대로 담긴다.
        3: ['4601', '4602', '4603', ...]    // 3호선의 정류장 순서대로 담긴다.
        ...
      }
      ```
    */
    function getMetroStationCdsByOrder(seoulMetroData: any) {
      const result: any = {};

      const metroCds: any[] = Object.keys(seoulMetroData);
      let metroCd;
      // 노선별 역 코드(station-cd) 추출
      for (metroCd of metroCds) {
        const stationcds = [];
        const { stations } = seoulMetroData[metroCd]; // "stations": 정류장별 역코드를 가지고 있는 배열

        let len: number, i: number;
        len = stations.length;
        for (i = 0; i < len; i++) {
          let station = stations[i];
          if (station['station-cd']) {
            stationcds.push(station['station-cd']); // station-cd: 역 코드
          }
        }

        result[metroCd] = Array.from(new Set(stationcds));
      }

      return result;
    }

    /**
     * stationCds를 기준으로 stations에 stationSeq를 할당한다. 
     * - 이 함수는 stationSeq를 기준으로 오름차순 정렬한 값을 리턴한다.
     * @param stations - [ { stationName, stationCd, stationFrCode, stationFrSeq: null }, ... ]
     * @param stationCds - ['0200', '0249', '0248', ... ]
     * @returns
      ```
        [
          ...
          [ "운정",	"1278",	"K329",	7 ]
          [ "야당",	"1277",	"K328",	8 ],
          [ "탄현",	"1276",	"K327",	9 ],
          ...
        ]
      ```
    */
    function makeStationDatas(stationDatas: any[], stationCds: any[]): StationData[] {
      const copyStationDatas: StationData[] = [...stationDatas];

      // 배열 길이가 다른 경우: stationCd 기준으로 내림차순 정렬하고, 정렬된 순서로 seq 부여
      if (stationCds.length !== copyStationDatas.length) {
        copyStationDatas.sort((a, b) => Number(b.stationCd) - Number(a.stationCd));
        return copyStationDatas.map((station: any, i: number) => ({ ...station, stationSeq: i + 1 }));
      }

      // 배열 길이가 같은 경우: stationCds를 기준으로 seq 부여하고, seq를 기준으로 오름차순 정렬
      let i, len;
      len = stationCds.length;
      for (i = 0; i < len; i++) {
        const stationCd = stationCds[i];
        const index = copyStationDatas.findIndex(station => station.stationCd === stationCd);
        copyStationDatas[index] = { ...copyStationDatas[index], stationSeq: Number(i) + 1 };
      }
      copyStationDatas.sort((a, b) => Number(a.stationSeq) - Number(b.stationSeq));
      return copyStationDatas;
    }
  }
};
