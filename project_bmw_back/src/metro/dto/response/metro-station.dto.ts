import { IMetroStation } from '@metro/entities/MetroStation.entity';
import { BmStationDto } from '@shared/interface/bm-station.dto.interface';

export class MetroStationDto implements BmStationDto {
  // 노선 ID
  routeId!: number;
  // 경기도: 고유모바일번호(mobileNo) / 서울시: 정류소 고유번호(arsId), 서울시 지하철: 외부 코드(stationFrCode)
  arsId!: string;
  // 정류소 Id(pk)
  stationId!: number;
  // 지하철 역 이름
  stationName!: string;
  // 지하철 역 코드
  stationCd!: string;
  // 지하철 역 외부 코드
  stationFrCode!: string;
  // 지하철 역 순서
  stationSeq!: number;
  // 운행 방향
  direction!: string;
  // 회차지 여부
  turnYn!: 'Y' | 'N';
  // 상행(1) 하행(2) 여부
  inOutTag!: '1' | '2';
  // 타입
  label: 'M' = 'M';
  // api 타입
  type: 'data.seoul' = 'data.seoul';

  constructor(
    routeId: number,
    arsId: string,
    stationId: number,
    stationName: string,
    stationCd: string,
    stationFrCode: string,
    stationSeq: number,
    direction: string,
  ) {
    this.routeId = routeId;
    this.arsId = arsId;
    this.stationId = stationId;
    this.stationName = stationName;
    this.stationCd = stationCd;
    this.stationFrCode = stationFrCode;
    this.stationSeq = stationSeq;
    this.direction = direction;
  }

  // public static entityToDto(entity: IMetroStation) {}
}
