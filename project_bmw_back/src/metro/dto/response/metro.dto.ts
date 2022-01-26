import { IMetro } from '@metro/entities/Metro.entity';
import { MetroStation } from '@metro/entities/MetroStation.entity';
import { plainToClass, Type } from 'class-transformer';
import { MetroStationDto } from './metro-station.dto';

export class MetroDto {
  // metro pk
  routeId!: number;
  // 지하철 이름
  metroName!: string;
  // 지하철 코드
  metroCd!: string;
  // 지하철 운행 지역(서울)
  districtCd!: number;
  // 기점 역
  startStationName?: string;
  // 종점 역
  endStationName?: string;
  // 지하철에 속한 역들
  @Type(type => MetroStationDto)
  metroStations?: MetroStationDto[];

  private constructor(data: any) {
    const { routeId, metroName, metroCd, districtCd, startStationName, endStationName, metroStations } = data;
    this.routeId = routeId;
    this.metroName = metroName;
    this.metroCd = metroCd;
    this.districtCd = districtCd;
    this.startStationName = startStationName ? startStationName : undefined;
    this.endStationName = endStationName ? endStationName : undefined;
    this.metroStations = metroStations ? metroStations : undefined;
  }

  /**
   * 순수 Metro Entity MetroDto로 생성
   * @param entity
   * @returns
   */
  public static entityToDto(entity: IMetro): MetroDto {
    return new MetroDto(entity);
  }

  /**
   * Metro Entity에 자식 객체인 metroStations 있는 경우 MetroDto 생성
   * - TODO: 1, 2, 5, 6, 경의중앙, 경춘선은 지선이 있어 순서가 다르다. 때문에 더 나은 방법이 필요하다.
   * @param entity
   * @returns
   */
  public static entityTreeToDto(entity: IMetro): MetroDto {
    const { routeId, metroStations } = entity;
    return new MetroDto(makeMetroData(metroStations));

    function makeMetroData(stations: MetroStation[]): MetroDto {
      // 기점 역
      const startStationName: string = stations[0].stationName;
      // 종점 역
      const endStationName: string = stations[stations.length - 1].stationName;

      /* MetroStationDto에 넣을 데이터 생성  */
      // reverseStation = stations 복사 -> 종점 제거 -> 역순 정렬
      const copyStations: MetroStation[] = [...stations];
      const endStationSeq: number = copyStations.pop()!.stationSeq;
      const reverseStation: MetroStation[] = copyStations.sort((a, b) => b.stationSeq - a.stationSeq);

      // stations + reverseStation => seq 신규, 회차지여부, 상행/하행 코드 부여
      const metroStations: any[] = [...stations, ...reverseStation].map((station: MetroStation, i: number) => {
        const newStationSeq = i + 1;
        return {
          ...station,
          routeId,
          stationSeq: newStationSeq,
          direction: newStationSeq < endStationSeq ? endStationName : startStationName,
          // 종점 순번 보다 작으면 '1'(상행) 부여, 종점 순번보다 크면 '2'(하행)
          inOutTag: newStationSeq < endStationSeq ? '1' : '2',
          // 종점이면 회차지('Y') 부여.
          turnYn: endStationSeq !== newStationSeq ? 'N' : 'Y',
          // bus와 통합용 데이터
          arsId: station.stationFrCode,
          createdAt: undefined,
          updatedAt: undefined,
        };
      });

      return {
        ...entity,
        startStationName,
        endStationName,
        metroStations: plainToClass(MetroStationDto, metroStations, { exposeDefaultValues: true }),
      };
    }
  }
}
