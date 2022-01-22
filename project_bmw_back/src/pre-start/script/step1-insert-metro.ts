// import '../index'; // Must be the first import
import { config } from '@config';
import { promises } from 'fs';
import { join } from 'path';
// api
import { XMLParser } from 'fast-xml-parser';
import { OpenApi } from '@shared/open-api';
// typeorm
import * as typeorm from '@db/database';
import { MetroRepository } from '@metro/repository/metro.repository';
import { getCustomRepository } from 'typeorm';
import { Metro } from '@metro/entities/Metro.entity';
// dto
import { CreateMetroDto } from '@metro/dto/request/create-metro.dto';
import { CreateMetroStationDto } from '@metro/dto/request/create-metro-station-dto';
import { transformAndValidate } from 'class-transformer-validator';
// import { seoulMetroData } from './seoul-metro-data';

const fileName = './seoul-metro-data.ts'; // 동적으로 생성할 파일명
const api = new OpenApi(new XMLParser());

const { openApi } = config;
const { environment, mysql } = config;
const { host, key } = openApi.seoul.metro;

(async () => {
  // 1) 노선별 정거장 순서를 찾을수 있는 데이터 웹에서 동적 가져와 생성한다.
  await writeMetroData();
  const { seoulMetroData } = await import(fileName);

  let conn;
  try {
    conn = await typeorm.getConnection(environment, mysql, false, false);
    const metroRepo: MetroRepository = getCustomRepository(MetroRepository);

    /*===================== # 1. metro table insert ====================== */
    // 1) CreateMetroDto에 담을 데이터 가공
    const metroDatas = Object.keys(seoulMetroData).map((key: any, i) => {
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

    // 1) 웹에서 가져온 seoulMetroData를 사용해 노선별 정류장 순서대로 station-cd 데이터를 추출한다.
    const stationCdsObj = getMetroStationCds(seoulMetroData);

    // 2) open api로 모든 노선별 정류장 데이터를 조회한다. (결과 2차 배열로 담긴다.)
    const stationData2ndArr = await Promise.all(metros.map(metro => getStationsByMetroName(metro.metroName)));

    // 3) CreateMetroStationDtos에 담을 데이터 가공한다.
    const stationDatas = stationData2ndArr.map((stationDatas, i) => {
      const stations = stationDatas.map(stationData => {
        const { STATION_CD, STATION_NM, FR_CODE } = stationData;
        return {
          stationName: STATION_NM, // 역 이름
          stationCd: STATION_CD, // 역 코드
          stationFrCode: FR_CODE, // 역 외부 코드
          stationSeq: null, // 역 순서는 다음 단계 부여
        };
      });

      // 4) stationCdsObj를 사용하여 stationSeq에 순서 부여한다.
      const { metroCd } = metros[i]; // i === 0이라면? 1호선 => metros_cd: 1
      return makeStationsSeq(stations, stationCdsObj[metroCd]);
    });

    // 5) CreateMetroStationDto를 생성
    const createMetroStationDtos: any = await Promise.all(
      stationDatas.map(stationData => transformAndValidate(CreateMetroStationDto, stationData)),
    );

    // 6) metro_station에 insert 실행
    // 부모인 Metro를 통해 자식객체인 MetroStations를 추가한다.
    await Promise.all(
      metros.map((metro: Metro, i: number) => {
        // 기존 데이터가 없으니 할당으로 처리,
        // 기존 자식 데이터가 있는경우는 **push() 해야한다.
        metro.metroStations = createMetroStationDtos[i];
        return metroRepo.save(metro);
      }),
    );
  } catch (error) {
    console.error(error);
  } finally {
    conn?.close();
  }
})();

/**
 * 서울 교통공사 웹 사이트의 데이터를 사용하여 ts 파일 생성
 * - 이 데이터를 통해 열차 순서 정보를 알 수 있다.
 */
async function writeMetroData(): Promise<void> {
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
 * 서울시 열린데이터 광장 OPEN API - 서울시 지하철역 정보 검색 (역명)
 * @param metroName - 노선 이름
 * @returns
  ```
  [
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
async function getStationsByMetroName(metroName: string): Promise<any[]> {
  const serviceName = 'SearchSTNBySubwayLineInfo';
  const url = `${host}/${key}/json/${serviceName}/1/300/ / /${encodeURI(getMetroNames(metroName))}`;
  const { SearchSTNBySubwayLineInfo } = await api.callApi(url, false);

  if (!SearchSTNBySubwayLineInfo) throw Error('["getStationsByMetroName"] ::: API 요청이 잘못되었습니다.');

  const { RESULT, row } = SearchSTNBySubwayLineInfo;
  if (!RESULT || RESULT.CODE !== 'INFO-000') {
    const { CODE, MESSAGE } = RESULT;
    const message = `['getStationsByMetroName'] ::: code: ${CODE}, message: ${MESSAGE ?? '정의되지 않은 오류입니다.'}`;
    throw Error(message);
  }

  return row;

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
 * 노선별로 seoulMetroData에 정의된 station-cd 순으로 데이터 추출
 * @returns 
 ```
 {
    1: ['0200', '0249', '0248', ... ]
    2: ['3139', '3138', '3137', ...]
    3: ['4601', '4602', '4603', ...]
    ...
  }
  ```
*/
function getMetroStationCds(seoulMetroData: any) {
  const metroCodes: any[] = Object.keys(seoulMetroData);
  const stationsObj: any = {};
  const result: any = {};

  Object.keys(seoulMetroData).map((key: any, i) => {
    const { stations } = seoulMetroData[key];
    stationsObj[key] = stations;
    return stations;
  });

  metroCodes.map(metroCode => {
    const stations = stationsObj[metroCode];
    const temp = [];
    let station: any;
    for (station of stations) {
      if (station['station-cd']) temp.push(station['station-cd']);
    }

    result[metroCode] = Array.from(new Set(temp));
    return temp;
  });

  return result;
}

/**
 * stationCds를 기준으로 stations에 stationFrSeq를 부여하고, stationFrSeq를 기준으로 오름차순 정렬한 값을 리턴한다.
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
function makeStationsSeq(stations: any[], stationCds: any[]) {
  const result = [];
  // 배열 길이가 다른 경우: stationCd 기준으로 내림차순 정렬하고, 정렬된 순서로 seq 부여
  if (stationCds.length !== stations.length) {
    stations.sort((a, b) => b.stationCd - a.stationCd);
    return stations.map((station, i) => ({ ...station, stationSeq: Number(i) + 1 }));
  }

  // 배열 길이가 같은 경우: stationCds를 기준으로 seq 부여하고, seq를 기준으로 오름차순 정렬
  for (let i in stationCds) {
    const stationCd = stationCds[i];
    const index = stations.findIndex(station => station.stationCd === stationCd);
    stations[index].stationSeq = Number(i) + 1;
  }
  stations.sort((a, b) => a.stationSeq - b.stationSeq);

  return stations;
}
