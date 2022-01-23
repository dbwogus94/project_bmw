import { MetroStation } from '@metro/entities/MetroStation.entity';
import { MetroStationRepository } from '@metro/repository/metro-station.repository';
import { OpenApi } from '@shared/open-api';
import { Connection, getCustomRepository, LessThan } from 'typeorm';

interface TimetableData {
  trainNo: string; // 열차 번호
  arriveTime: string; // 역 도착 시간
  leftTime: string; // 역 출발 시간

  originStationCd: string; // 기점역 코드
  originStationName: string; // 종점역 코드
  destStationCd: string; // 종점역 코드
  destStationName: string; // 종점역 이름

  weekTag: string; // 요일 구분 태그: 평일:1, 토요일:2, 휴일/일요일:3
  inOutTag: string; // 상행 하행 구분 태그: 상행,내선:1, 하행,외선:2
  expressTag: string; // 급행 여부: 급행(G일반, D급행)

  flFlag: string; // 플러그
  destStationCd2: string; // 도착역 코드2
  branchLine: string; // 지선
}

interface RawTimetableData {
  FR_CODE: string; // 역 외부 코드
  STATION_CD: string; // 역 코드
  STATION_NM: string; // 역 이름
  //
  TRAIN_NO: string; // 열차 번호
  ARRIVETIME: string; // 역 도착 시간
  LEFTTIME: string; // 역 출발 시간
  ORIGINSTATION: string; // 기점역 코드
  SUBWAYSNAME: string; // 기점역 이름
  DESTSTATION: string; // 종점역 코드
  SUBWAYENAME: string; // 종점역 이름
  WEEK_TAG: string; // 요일 구분 태그: 평일:1, 토요일:2, 휴일/일요일:3
  INOUT_TAG: string; // 상행 하행 구분 태그: 상행,내선:1, 하행,외선:2
  EXPRESS_YN: string; // 급행 여부: 급행(G일반, D급행)
  //
  FL_FLAG: string; // 플러그
  DESTSTATION2: string; // 도착역 코드2
  BRANCH_LINE: string; // 지선
}

/**
 * 서울시 열린광장 API에서 제공하는 시간표는 1호선에서 8호선까지만 제공한다.
 * - 노선의 역 하나당 6번의 조회가 필요하다. => 2(상행, 하행) *  3(평일, 토요일, 공휴일)
 * - 총 요청 횟수 = (1 ~ 8 역 개수) * 6
 * - 현재 기준: 417 * 6 = 2502번 요청
 */
export default async (conn: Connection, api: OpenApi, apiConfig: any) => {
  const { host, key } = apiConfig.seoul.metro;

  const metroStationRepo: MetroStationRepository = getCustomRepository(MetroStationRepository);

  try {
    // 1~8호선 검색
    const metroStations: MetroStation[] = await metroStationRepo.find({
      select: ['id', 'stationCd', 'metro'],
      relations: ['metro'],
      where: {
        metro: {
          metroId: LessThan(9),
        },
      },
      order: {
        metro: 'ASC',
      },
    });

    await metroStations.reduce(async (previousPromise: any, curr) => {
      await previousPromise;
      return scriptJob(curr, metroStationRepo);
    }, Promise.resolve());
  } catch (error) {
    console.error('[ERROR] ::: step2-insert-timetable');
    throw error;
  }

  /**
   * 최소 작업단위 => 역하나의 시간표를 모두 추가한다.
   * - api 6번 호출 : 2(상행, 하행) *  3(평일, 토요일, 공휴일)
   * - 부모인 metroStation을 사용하여 insertMay 실행
   * @param metroStation
   * @returns
   */
  async function scriptJob(metroStation: MetroStation, metroStationRepo: MetroStationRepository) {
    const { stationCd } = metroStation;

    // api 6번 호출
    const rowTimetableDatas: RawTimetableData[] = await callAPis();
    const timetableDatas: any[] = rowTimetableDatas.map(rowTimetableData => rawDataToTimetableData(rowTimetableData));

    metroStation.metroTimetables = timetableDatas;
    return metroStationRepo.save(metroStation);

    async function callAPis() {
      const result = await Promise.all(
        [1, 2, 3]
          .map((weekTag: number) => [1, 2].map((inOutTag: number) => callTimetableData(stationCd, weekTag, inOutTag)))
          .flat(),
      );
      return result.flat();
    }
  }

  /**
   * 서울시 열린데이터 광장 OPEN API 호출
   * - 서울시 역코드로 지하철역별 열차 시간표 정보 검색
   * @param stationCd - 역 코드
   * @param weekTag - 평일(1), 토요일(2), 휴일/일요일(3) 구분 코드
   * @param inOutTag - 상행,내선(1), 하행,외선(2) 구분 코드
   * @returns
    ```
    ```
    * @throws api Error
    */
  async function callTimetableData(stationCd: string, weekTag: number, inOutTag: number): Promise<any> {
    const serviceName = 'SearchSTNTimeTableByIDService';
    const url = `${host}/${key}/json/${serviceName}/1/500/${stationCd}/${weekTag}/${inOutTag}`;
    const { SearchSTNTimeTableByIDService } = await api.callApi(url, false);

    if (!SearchSTNTimeTableByIDService) {
      throw Error('["getStationsByMetroName"] ::: API 요청이 잘못되었습니다.');
    }

    const { RESULT, row } = SearchSTNTimeTableByIDService;
    if (!RESULT || RESULT.CODE !== 'INFO-000') {
      const { CODE, MESSAGE } = RESULT;
      const message = `['getStationsByMetroName'] ::: code: ${CODE}, message: ${MESSAGE ?? '정의되지 않음.'}`;
      throw Error(message);
    }

    return row;
  }

  function rawDataToTimetableData(rawData: RawTimetableData): TimetableData {
    const {
      FR_CODE,
      STATION_CD,
      STATION_NM,
      TRAIN_NO,
      ARRIVETIME,
      LEFTTIME,
      ORIGINSTATION,
      SUBWAYSNAME,
      DESTSTATION,
      SUBWAYENAME,
      WEEK_TAG,
      INOUT_TAG,
      EXPRESS_YN,
      FL_FLAG,
      DESTSTATION2,
      BRANCH_LINE,
    } = rawData;

    return {
      trainNo: TRAIN_NO,
      arriveTime: ARRIVETIME,
      leftTime: LEFTTIME,

      originStationCd: ORIGINSTATION,
      originStationName: SUBWAYSNAME,
      destStationCd: DESTSTATION,
      destStationName: SUBWAYENAME,

      weekTag: WEEK_TAG,
      inOutTag: INOUT_TAG,
      expressTag: EXPRESS_YN,

      flFlag: FL_FLAG,
      destStationCd2: DESTSTATION2,
      branchLine: BRANCH_LINE,
    };
  }
};
