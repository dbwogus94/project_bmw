import { IMetroStation } from '@metro/entities/MetroStation.entity';

export class MetroStationDto {
  metroStationId!: number;
  stationName!: string;
  stationCd!: string; // 지하철 역 코드
  stationFrCode!: string; // 지하철 역 외부 코드
  stationSeq!: number;

  // constructor(entity: IMetroStation) {
  //   const { metroStationId, stationName, stationCd, stationFrCode, stationSeq } = entity;
  //   this.metroStationId = metroStationId;
  //   this.stationName = stationName;
  //   this.stationCd = stationCd;
  //   this.stationFrCode = stationFrCode;
  //   this.stationSeq = stationSeq;
  // }
}
